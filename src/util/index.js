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
        let result = 'CN=' + subject.commonName;
        if (subject.organization) {
            result += ',O=' + subject.organization;
        }
        if (subject.organizationalUnit) {
            result += ',OU=' + subject.organizationalUnit;
        }
        if (subject.country) {
            result += ',C=' + subject.country;
        }
        if (subject.stateOrProvinceName) {
            result += ',ST=' + subject.stateOrProvinceName;
        }
        return result;
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
    flatRes(res) {
        return res.map((item, index) => {
            item.requestId = item.request.id;
            item.content = `证书主体：${this.transferDN(item.subject)}`;
            item = this.flatObj(item);
            item.title = `证书${index + 1}`;
            item.description = `序列号：${item.serialNumber}，有效期：${new Date(item.notBefore).toLocaleString()} - ${new Date(item.notAfter).toLocaleString()}`;
            delete item.id;
            return item;
        });
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