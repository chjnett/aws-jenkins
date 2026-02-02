declare global {
    interface Window {
        kakao: any;
    }
}

export interface KakaoMapProps {
    center?: {
        lat: number;
        lng: number;
    };
    level?: number;
    className?: string;
    markers?: Array<{
        position: {
            lat: number;
            lng: number;
        };
        title?: string;
        content?: string;
    }>;
    onMarkerClick?: (marker: any) => void;
}

export { };
