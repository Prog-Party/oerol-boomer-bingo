'use client'

import { useEffect, useState } from 'react'
import { WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon, TwitterShareButton, XIcon, TelegramShareButton, TelegramIcon } from 'react-share'

export default function SocialShare() {

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '' // Fallback for SSR
    const [title, setTitle] = useState('')

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setTitle(document.title) // Get the page title
        }
    }, [])

    return (
        <div className="flex gap-x-4 items-center justify-center mt-4">
            <div className="mb-4">
                <FacebookShareButton url={shareUrl}>
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
            </div>
            <div className="mb-4">
                <TwitterShareButton
                    url={shareUrl}
                    title={title}
                >
                    <XIcon size={32} round />
                </TwitterShareButton>
            </div>
            <div className="mb-4">
                <TelegramShareButton
                    url={shareUrl}
                    title={title}
                >
                    <TelegramIcon size={32} round />
                </TelegramShareButton>
            </div>
            <div className="mb-4">
                <WhatsappShareButton
                    url={shareUrl}
                    title={title}
                    separator=":: "
                >
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
            </div>
        </div>
    )
}