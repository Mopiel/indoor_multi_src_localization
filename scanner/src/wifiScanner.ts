import scanner from 'node-wifi-scanner';

export class WifiScanner {
    private scanner = scanner
    public scanArea = () => {
        return new Promise((resolve, reject) => {
            this.scanner.scan((err, networks) => {
                if (err) {
                    console.error(err.message)
                    reject({})
                    return;
                }
                resolve(networks);
            });
        })
    }
}

export default scanner