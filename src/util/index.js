export default {
    transferDN(subject) {
        return 'CN=' + subject.commonName
            + ',O=' + subject.organization
            + ',OU=' + subject.organizationalUnit
            + ',C=' + subject.countryName
            + ',ST=' + subject.provinceName;
    },

    flatObj(obj) {
        let result = {};
        for (let key in obj) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                result = { ...result, ...this.flatObj(obj[key]) };
            } else if (obj[key] !== null) {
                result[key] = obj[key];
            }
        }
        return result;
    },

    download(data, filename, type) {
        let url = window.URL.createObjectURL(
            new Blob([data], { type: type })
        );
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
};