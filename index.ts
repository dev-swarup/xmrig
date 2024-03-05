import { join } from "node:path";
import { dlopen, suffix, FFIType } from "bun:ffi";
const { symbols: { start } } = dlopen(join(__dirname, 'build', `libxmrig.${suffix}`), { start: { args: [FFIType.cstring], returns: FFIType.ptr } });

import { tmpdir } from "node:os";
import { mkdirSync, writeFileSync } from "node:fs"
export class XMRig {
    private dir: string = `${tmpdir()}/xmrig_${(Math.random() * 10000).toFixed()}`;
    private path: string = `${this.dir}/config.json`;
    private config = {
        "api": {
            "id": null,
            "worker-id": null
        },
        "http": {
            "enabled": false,
            "host": "127.0.0.1",
            "port": 0,
            "access-token": null,
            "restricted": true
        },
        "autosave": false,
        "background": false,
        "colors": true,
        "title": true,
        "randomx": {
            "init": -1,
            "init-avx2": -1,
            "mode": "auto",
            "1gb-pages": false,
            "rdmsr": true,
            "wrmsr": true,
            "cache_qos": false,
            "numa": true,
            "scratchpad_prefetch_mode": 1
        },
        "cpu": {
            "enabled": true,
            "huge-pages": true,
            "huge-pages-jit": false,
            "hw-aes": null,
            "priority": null,
            "memory-pool": false,
            "yield": true,
            "max-threads-hint": 100,
            "asm": true,
            "argon2-impl": null,
            "cn/0": false,
            "cn-lite/0": false
        },
        "opencl": {
            "enabled": false,
            "cache": true,
            "loader": null,
            "platform": "AMD",
            "adl": true,
            "cn/0": false,
            "cn-lite/0": false
        },
        "cuda": {
            "enabled": false,
            "loader": null,
            "nvml": true,
            "cn/0": false,
            "cn-lite/0": false
        },
        "donate-level": 1,
        "donate-over-proxy": 1,
        "log-file": null,
        "pools": [
            {
                "algo": null,
                "coin": null,
                "url": "donate.v2.xmrig.com:3333",
                "user": "YOUR_WALLET_ADDRESS",
                "pass": "x",
                "rig-id": null,
                "nicehash": false,
                "keepalive": false,
                "enabled": true,
                "tls": false,
                "tls-fingerprint": null,
                "daemon": false,
                "socks5": null,
                "self-select": null,
                "submit-to-origin": false
            }
        ],
        "print-time": 60,
        "health-print-time": 60,
        "dmi": true,
        "retries": 5,
        "retry-pause": 5,
        "syslog": false,
        "tls": {
            "enabled": false,
            "protocols": null,
            "cert": null,
            "cert_key": null,
            "ciphers": null,
            "ciphersuites": null,
            "dhparam": null
        },
        "dns": {
            "ipv6": false,
            "ttl": 30
        },
        "user-agent": null,
        "verbose": 0,
        "watch": true,
        "pause-on-battery": false,
        "pause-on-active": false
    };

    constructor(...pools: {
        algo?: string;
        coin?: string;
        url?: string;
        user?: string;
        pass?: string;
        "rig-id"?: string;
        nicehash?: boolean;
        keepalive?: boolean;
        enabled?: boolean;
        tls?: boolean;
        "tls-fingerprint"?: boolean;
        daemon?: boolean;
        socks5?: string;
        "self-select"?: string;
        "submit-to-origin"?: boolean;
    }[]) {
        if (pools.length > 0)
            /// @ts-expect-error
            this.config.pools = pools;
    };

    setPrintTime(time: number): number {
        this.config["print-time"] = time;
        this.config['health-print-time'] = time;

        return time;
    };

    enableHTTP(options?: {
        port: number;
        host?: number;
        "access-token"?: string;
    }): void {
        /// @ts-expect-error
        this.config.http = { ...options, ...{ restricted: false, enabled: true } };
    };

    start = (): Promise<number> => new Promise((resolve, reject) => {
        mkdirSync(this.dir, { recursive: true });
        writeFileSync(this.path, JSON.stringify(this.config), { encoding: 'utf8', });
        const app = start(Buffer.from(this.path));

        if (app === 0)
            resolve(0);
        else
            reject(app);
    });
};