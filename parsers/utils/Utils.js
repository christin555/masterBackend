class Utils {
    static url2path(url) {
        if (url[0] === '/') {
            return url.slice(1).replace(/\//g, '-');
        }

        return url.replace(/\//g, '-');
    };

    static sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    };

    static isDev() {
        return process.env.ENV !== 'development' || true;
    }

    static matchStr(s1, s2) {
        return s1.toLowerCase().indexOf(s2.toLowerCase()) > -1;
    }
}

module.exports = {Utils};