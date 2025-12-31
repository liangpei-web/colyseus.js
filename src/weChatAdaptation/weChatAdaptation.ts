import NodeWebSocket from "ws";

if (window['wx']) {
    console.log('微信平台适配已启用');

    // 微信小游戏不支持 URL API，需要加载 polyfill
    if (typeof URL === 'undefined' || !URL.prototype) {
        console.log('微信平台: 加载 URL polyfill');
        require('url-polyfill');
    }

    const OriginalWebSocket = globalThis.WebSocket || NodeWebSocket;

    // 重写 WebSocket 构造函数，适配微信平台不支持 headers 的情况
    const AdaptedWebSocket = function (url: string, protocolsOrOptions?: any) {
        let protocols: string | string[] | undefined;

        // 微信平台：只支持 protocols 参数，不支持 options 对象
        if (protocolsOrOptions) {
            if (typeof protocolsOrOptions === 'object' && !Array.isArray(protocolsOrOptions)) {
                // 如果是对象（包含 headers 和 protocols），只提取 protocols
                protocols = protocolsOrOptions.protocols;
                console.log('微信平台: 已过滤 headers，仅使用 protocols', protocols);
            } else {
                // 如果是字符串或数组，直接使用
                protocols = protocolsOrOptions;
            }
        }

        // 调用原生 WebSocket，只传递 url 和 protocols
        return new OriginalWebSocket(url, protocols);
    } as any;

    // 复制原型链和静态属性
    AdaptedWebSocket.prototype = OriginalWebSocket.prototype;
    AdaptedWebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
    AdaptedWebSocket.OPEN = OriginalWebSocket.OPEN;
    AdaptedWebSocket.CLOSING = OriginalWebSocket.CLOSING;
    AdaptedWebSocket.CLOSED = OriginalWebSocket.CLOSED;

    // 替换全局 WebSocket
    (globalThis as any).WebSocket = AdaptedWebSocket;

    // 适配 send 方法：微信平台需要 ArrayBuffer 而不是 Uint8Array
    const WebSocket_send = OriginalWebSocket.prototype.send;
    OriginalWebSocket.prototype.send = function (data) {
        if (data instanceof Uint8Array) {
            WebSocket_send.call(this, data.slice().buffer);
        } else if (Array.isArray(data)) {
            WebSocket_send.call(this, (new Uint8Array(data)).buffer);
        } else {
            WebSocket_send.call(this, data);
        }
    }
}