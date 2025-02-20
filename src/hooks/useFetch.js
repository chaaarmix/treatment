import { useEffect } from 'react';

const useFetch = (url, setList) => {
    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setList(data))
            .catch(error => console.error("Error loading data:", error));
    }, [url, setList]);
};

export default useFetch;