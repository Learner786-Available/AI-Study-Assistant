import Cropper from "react-easy-crop";

export default function ImageCropper({

    image,

    crop,

    zoom,

    setCrop,

    setZoom

}) {

    return (

        <div className="relative w-full h-80 bg-gray-900 rounded-xl overflow-hidden">

            <Cropper

                image={image}

                crop={crop}

                zoom={zoom}

                aspect={1}

                cropShape="round"

                showGrid={false}

                onCropChange={setCrop}

                onZoomChange={setZoom}

            />

        </div>

    );

}