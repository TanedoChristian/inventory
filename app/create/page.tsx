"use client";

import axios from "axios";


export default function Page() {

    const handleCreateTenant = async () =>{
        await axios.post('/api/tenants', {
            name: 'Tenant Test',
            code: 'codespehere.io'});
    }

    return (
        <button onClick={handleCreateTenant}>Click Me</button>
    )
}