import {Request} from './Request';

export class RequestQueue {
    constructor(opts) {
        this.srcUrl = opts.srcUrl || '';
        this.send = opts.send || {};
        this.queryName = opts.queryName || 'q';
        this.querying = false;
        this.currentQuery = false;
        this.sentQuery = false;
        //this.receivedQuery = false;
        this.interval = opts.interval || 500;

        this.request = new Request();

        if (!this.srcUrl) {
            throw 'srcUrl cannot be empty';
        }
    }

    queryJson(query) {
        this.currentQuery = query;
        // console.log('currentQuery:' + this.currentQuery);

        if (this.querying) {
            return this;
        }

        if (this.sentQuery === this.currentQuery) {
            return this;
        }

        this.querying = true;
        this.send[this.queryName] = query;
        this.sentQuery = query;

        // console.log('sentQuery:' + this.sentQuery);

        this.request.ajax({
            method: this.method,
            url: this.srcUrl,
            dataType: 'json',
            send: this.send,
            withCredentials: true
        }).then(data => {
            //console.log(data);
            this.callLoad(data);

            setTimeout(() => {
                this.querying = false;
                this.queryJson(this.currentQuery);
            }, this.interval);
        }).catch(err => {
            this.querying = false;
            this.callErr(err);
        });

        return this;
    }

    clear() {
        this.sentQuery = null;
    }

    queryPostJson(query) {
        this.method = 'post';
        return this.queryJson(query);
    }

    queryGetJson(query) {
        this.method = 'get';
        return this.queryJson(query);
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
