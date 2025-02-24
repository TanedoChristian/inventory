"use client";


export default function Page() {

    const handleCreateTenant = () =>{
        fetch('/api/tenants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Tenant 1',
                code: 'T1'
            })
        });
    }

    return (
        <button onClick={handleCreateTenant}>Click Me</button>
    )
}