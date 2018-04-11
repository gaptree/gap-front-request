import {toFormData} from 'gap-front-form';
import {createXhr} from './createXhr.js';
import {buildSortedQuery} from './buildSortedQuery.js';

// withCredentials
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials

// Cross-Origin Resource Sharing (CORS)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

// CORS on Nginx
// https://enable-cors.org/server_nginx.html

export class Request {
    constructor() {
        this.header = {};
    }

    getXhr() {
        if (this.xhr) {
            return this.xhr;
        }

        this.xhr = createXhr();
        return this.xhr;
    }

    getStatus() {
        return this.getXhr().status;
    }

    ajax (opts) {
        return new Promise((resolve, reject) => {
            const method = (opts.method || 'get').toUpperCase(),
                async = opts.async === false ? false : true,
                url = opts.url || '',
                optDataType = opts.dataType || 'html',
                xhr = this.getXhr();

            const handleSuccess = (dataType) => {
                if (dataType === 'html') {
                    resolve(xhr.responseText);
                } else if (dataType === 'json') {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject({
                        status: xhr.status,
                        error: 'unkown dataType ' + dataType,
                        responseText: xhr.responseText
                    });
                }
            };

            const handleFailed = (dataType) => {
                if (dataType === 'html') {
                    reject(xhr.responseText);
                } else if (dataType === 'json') {
                    reject(JSON.parse(xhr.responseText));
                } else {
                    reject({
                        status: xhr.status,
                        error: 'error http status',
                        responseText: xhr.responseText
                    });
                }
            };

            if (this.withCredentials && xhr.withCredentials !== true) {
                xhr.withCredentials = true;
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                if (xhr.status === 200) {
                    handleSuccess(optDataType);
                } else {
                    handleFailed(optDataType);
                }
            };

            xhr.onerror = () => {
                reject({status: xhr.status, responseText: xhr.responseText});
            };

            xhr.open(method, url, async);

            if (this.header) {
                for (let index in this.header) {
                    if (this.header.hasOwnProperty(index)) {
                        xhr.setRequestHeader(index, this.header[index]);
                    }
                }
            }

            const sendBody = opts.send ? toFormData(opts.send) : null;
            xhr.send(sendBody);
        });
    }

    addHeader (key, val) {
        this.header[key] = val;
    }

    getJson (url, send) {
        url += '?' + buildSortedQuery(send);

        return this.ajax(
            {
                method: 'get',
                url: url,
                dataType: 'json'
            }
        );
    }

    postJson(url, send) {
        return this.ajax(
            {
                method: 'post',
                url: url,
                dataType: 'json',
                send: send
            }
        );
    }
}
