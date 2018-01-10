import {Request} from '../index.js';
import {MockXhr} from '../__mocks__/MockXhr.js';

describe('Request', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest;

    beforeEach(() => {
        window.XMLHttpRequest = MockXhr;
    });

    afterEach(() => {
        window.XMLHttpRequest = oldXMLHttpRequest;
    });

    test('postJson', async () => {
        const request = new Request();
        const xhr = request.getXhr();
        xhr.responseText = JSON.stringify([
            {title: 'first'},
            {title: 'second'}
        ]);

        const data = await request.postJson('http://www.test.cn');

        expect(data[0].title).toBe('first');
        expect(data[1].title).toBe('second');
    });

    test('postJson SyntaxError', async () => {
        const request = new Request();

        try {
            await request.postJson('http://www.test.cn');
        } catch (error) {
            expect(error.status).toBe(200);
            expect(error.error).toBeInstanceOf(SyntaxError);
            expect(error.responseText).toBeUndefined();
        }
    });

    test('error http status', async () => {
        const request = new Request();

        const xhr = request.getXhr();
        xhr.status = 404;
        xhr.responseText = 'error';

        try {
            await request.ajax({
                url: 'http:www.test.com'
            });
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.error).toBe('error http status');
            expect(error.responseText).toBe('error');
        }
    });
});
