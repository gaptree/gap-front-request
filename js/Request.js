import {toFormData} from 'gap-front-fun';
import {createXhr} from './createXhr.js';

// withCredentials
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials

// Cross-Origin Resource Sharing (CORS)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

// CORS on Nginx
// https://enable-cors.org/server_nginx.html

export class Request {
    constructor () {
        this.header = {};
    }

    getXhr () {
        if (this.xhr) {
            return this.xhr;
        }

        this.xhr = createXhr();
        return this.xhr;
    }

    ajax (opts) {
        return new Promise((resolve, reject) => {
            const method = (opts.method || 'get').toUpperCase(),
                async = opts.async === false ? false : true,
                url = opts.url || '',
                dataType = opts.dataType || 'html',
                xhr = this.getXhr();

            if (this.withCredentials) {
                xhr.withCredentials = true;
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }

                if (xhr.status !== 200) {
                    reject({
                        status: xhr.status,
                        error: 'error http status',
                        responseText: xhr.responseText
                    });
                    return;
                }

                if (dataType === 'html') {
                    resolve(xhr.responseText);
                    return;
                }
                
                if (dataType === 'json') {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (error) {
                        reject({
                            status: xhr.status,
                            error: error,
                            responseText: xhr.responseText
                        });
                    }
                    return;
                }

                reject({
                    status: xhr.status,
                    error: 'unkown dataType ' + dataType,
                    responseText: xhr.responseText
                });
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

    buildQuery(args) {
        var k, arr = [];
        for (k in args) {
            if (args.hasOwnProperty(k)) {
                arr.push(k + '=' + args[k]);
            }
        }
        return arr.join('&');
    }

    addHeader (key, val) {
        this.header[key] = val;
    }

    getJson (url, send) {
        url += '?' + this.buildQuery(send);

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
