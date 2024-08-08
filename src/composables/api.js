import axios from 'axios'

export function useApi () {
    function get (url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: params,
                responseType: 'json'
            }).then(response => {
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    }

    function post (url, data) {
        return new Promise((resolve, reject) => {
            axios.post(url, data)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    function put (url, data) {
        return new Promise((resolve, reject) => {
            axios.put(url, data)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    function destroy (url) {
        return new Promise((resolve, reject) => {
            axios.delete(url)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    return {
        get,
        post,
        put,
        destroy
    }
}


