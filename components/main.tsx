import React from "react";
import Script from "next/script";

export default function Main({children}: {children: React.ReactNode}) {
    return(
        <div>
            <header><h2>Fill-In</h2></header>
            <main>
                <Script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.js"></Script>
                {children}
            </main>
            <footer style={{textAlign: 'center'}}>&copy; {new Date().getFullYear()}</footer>
        </div>
    )
}
