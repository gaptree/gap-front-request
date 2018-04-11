import {Request} from './Request';

export class RequestQueue {
    constructor(url, opts) {
        const defaultOpts = {
            withCredentials: true,
            interval: 500,
            method: 'post',
            dataType: 'json'
        };

        this.url = url;

        this.sentArgs = {};
        this.currentArgs = {};

        this.opts = Object.assign({}, defaultOpts, opts);
        this.request = new Request();
    }

    isEqual(oneObj, twoObj) {
        for (let index in oneObj) {
            if (oneObj[index] !== twoObj[index]) {
                return false;
            }
        }

        return true;
    }

    clear() {
        this.sentArgs = {};
    }

    ajax(args) {
        this.currentArgs = args;
        if (this.querying) {
            return this;
        }
        if (this.isEqual(this.sentArgs, this.currentArgs)) {
            return this;
        }
        this.querying = true;
        this.sentArgs = args;

        this.request.ajax({
            url: this.url,
            send: args,
            method: this.opts.method,
            dataType: this.opts.dataType,
            withCredentials: this.opts.withCredentials
        }).then(data => {
            this.callLoad(data);

            setTimeout(() => {
                this.querying = false;
                this.ajax(this.currentArgs);
            }, this.interval);
        }).catch(err => {
            this.querying = false;
            this.callErr(err);
        });
    }

    getJson(args) {
        this.opts.method = 'get';
        this.opts.dataType = 'json';
        return this.ajax(args);
    }

    postJson(args) {
        this.opts.method = 'post';
        this.opts.dataType = 'json';
        return this.ajax(args);
    }

    onLoad(callback) {
        this.callLoad = callback;
        return this;
    }

    onErr(callback) {
        this.callErr = callback;
        return this;
    }
}
