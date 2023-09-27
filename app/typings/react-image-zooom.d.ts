declare module 'react-image-zooom' {
    interface ImageZoomProps {
        className?: string,
        id?: string,

        src: string

        zoom?: number,
        alt?: string,

        width?: string,
        height?: string
    }

    declare const ImageZoom: React.FC<ImageZoomProps>
    export default ImageZoom
}