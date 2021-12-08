import Document, {
    Head,
    Html,
    Main,
    NextScript,
} from 'next/document'
import React from 'react'

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta name="theme-color" content="#fff"/>
                    <link rel="preconnect" href="https://fonts.googleapis.com"/>
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
                    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600&display=swap"
                          rel="stylesheet"/>
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                    <div id="overlay-container"/>
                </body>
            </Html>
        )
    }
}

export default MyDocument
