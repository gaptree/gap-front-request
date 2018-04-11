export const buildSortedQuery = (args) => {
    return Object.keys(args)
        .sort()
        .map(key => {
            return window.encodeURIComponent(key)
                + '='
                + window.encodeURIComponent(args[key]);
        })
        .join('&');
};
