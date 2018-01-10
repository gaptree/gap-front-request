class MockXhr {
    constructor () {
        this.readyState = 4;
        this.status = 200;
    }

    open () {
    }

    send () {
        window.setTimeout(() => this.onreadystatechange(), 0);
    }
}

MockXhr.DONE = 4;

export {MockXhr};
