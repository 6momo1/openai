import { writable } from 'svelte/store';

export const APIKey = writable("");


export const setAPIKey = (newAPIKey) => {
    APIKey.update(APIKey => {
        APIKey = newAPIKey;
    })
}