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
}

module.exports = {Utils};