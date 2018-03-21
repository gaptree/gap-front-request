# Gap Http Request

## Install

```
$ yarn add gap-front-request
```

## Usage

```javascript
import {Request} from 'gap-front-request';

const request = new Request();

request.addHeader('User-Agent', 'Gap');

const postJson = await request.postJosn('//url.com', {
    key: 'val'
});

const getJson = await request.getJosn('//url.com', {
    key: 'val'
});

const ajax = await request.ajax({
    url: '//url.com',
    method: 'post'
});
```
