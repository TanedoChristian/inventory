"use client";

import axios from "axios";


export default function Page() {

    const handleCreateTenant = async () =>{
        await axios.post('/api/tenants', {
            name: 'adminCj',
            code: 'codespehere.io'});
    }

    return (
        <button onClick={handleCreateTenant}>Click Me</button>
    )
}