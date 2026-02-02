'use client'

import { useEffect, useRef, useState } from 'react'
import type { KakaoMapProps } from '@/types/kakao-maps'

/**
 * 카카오맵 컴포넌트
 * 제주도 에너지 거래 위치를 표시합니다.
 */
export function KakaoMap({
    center = { lat: 33.4996, lng: 126.5312 }, // 제주도 중심 좌표
    level = 10,
    className = '',
    markers = [],
    onMarkerClick,
}: KakaoMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const mapRef = useRef<any>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    // Kakao Maps SDK 로드 대기
    useEffect(() => {
        const checkKakaoMaps = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    setIsLoaded(true)
                })
                clearInterval(checkKakaoMaps)
            }
        }, 100)

        return () => clearInterval(checkKakaoMaps)
    }, [])

    useEffect(() => {
        // Kakao Maps SDK가 로드되었는지 확인
        if (!isLoaded || !window.kakao || !window.kakao.maps) {
            return
        }

        // 지도 초기화
        if (mapContainer.current && !mapRef.current) {
            const options = {
                center: new window.kakao.maps.LatLng(center.lat, center.lng),
                level: level,
            }

            const map = new window.kakao.maps.Map(mapContainer.current, options)
            mapRef.current = map

            // 지도 타입 컨트롤 추가
            const mapTypeControl = new window.kakao.maps.MapTypeControl()
            map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

            // 줌 컨트롤 추가
            const zoomControl = new window.kakao.maps.ZoomControl()
            map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)
        }
    }, [center.lat, center.lng, level, isLoaded])

    // 마커 추가
    useEffect(() => {
        if (!mapRef.current || !window.kakao || !isLoaded) return

        // 기존 마커 제거 (필요시)
        markers.forEach((markerData) => {
            const markerPosition = new window.kakao.maps.LatLng(
                markerData.position.lat,
                markerData.position.lng
            )

            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                title: markerData.title,
            })

            marker.setMap(mapRef.current)

            // 마커 클릭 이벤트
            if (markerData.content || onMarkerClick) {
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    if (onMarkerClick) {
                        onMarkerClick(markerData)
                    }

                    // 인포윈도우 표시
                    if (markerData.content) {
                        const infowindow = new window.kakao.maps.InfoWindow({
                            content: `<div style="padding:10px;font-size:12px;">${markerData.content}</div>`,
                        })
                        infowindow.open(mapRef.current, marker)
                    }
                })
            }
        })
    }, [markers, onMarkerClick, isLoaded])

    return (
        <div
            ref={mapContainer}
            className={`w-full h-full rounded-lg overflow-hidden ${className}`}
            style={{ minHeight: '400px' }}
        />
    )
}
