'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function KakaoMapScript() {
    useEffect(() => {
        // Kakao Maps SDK 로드 후 초기화
        const checkKakaoMaps = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    console.log('Kakao Maps SDK 로드 완료')
                })
                clearInterval(checkKakaoMaps)
            }
        }, 100)

        return () => clearInterval(checkKakaoMaps)
    }, [])

    const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY

    if (!kakaoMapKey) {
        console.warn('⚠️ NEXT_PUBLIC_KAKAO_MAP_KEY가 설정되지 않았습니다.')
        return null
    }

    return (
        <Script
            strategy="beforeInteractive"
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`}
        />
    )
}
