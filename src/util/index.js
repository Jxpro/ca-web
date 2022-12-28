export default {
    getShortString(name) {
        let shortName = '';
        let count = 0;
        for (let i = 0; i < name.length; i++) {
            if (name.charCodeAt(i) > 255) {
                count += 2;
            } else {
                count += 1;
            }
            if (count > 6) {
                break;
            }
            shortName += name[i];
        }
        if (count > 6) {
            shortName += '...';
        }
        return shortName;
    },

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