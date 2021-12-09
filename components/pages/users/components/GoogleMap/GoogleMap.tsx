import React, {
    FC,
    memo,
    useEffect,
    useRef,
    useState,
} from 'react'
import debounce from 'lodash/debounce'
import {useGoogleMaps} from 'react-hook-google-maps'
import Geocoder = google.maps.Geocoder
import Map = google.maps.Map
import MapMouseEvent = google.maps.MapMouseEvent
import Marker = google.maps.Marker
import classNames from 'classnames'
import styles from './GoogleMap.module.scss'

export interface Props {
    readonly className?: string
    readonly address: string
    readonly onAddressChange: (address: string) => void
    readonly onError: (message: string | null) => void
}

export const GoogleMap: FC<Props> = memo(({className, address, onError, onAddressChange}) => {
    const {ref: mapRef, map, google} = useGoogleMaps(
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        {
            center: {lat: 0, lng: 0},
            zoom: 17,
            disableDoubleClickZoom: true,
            fullscreenControl: false,
            disableDefaultUI: true,
            zoomControl: false,
        },
    )

    const [isLoading, setLoadingState] = useState(true)
    const [localAddress, setLocalAddress] = useState('')
    const markerRef = useRef<Marker | null>(null)
    const decoderRef = useRef<Geocoder | null>(null)

    useEffect(() => {
        if (!google || !map) {
            return
        }
        if (!markerRef.current) {
            markerRef.current = new google.maps.Marker({
                map,
            })
        }
        if (!decoderRef.current) {
            decoderRef.current = new google.maps.Geocoder()
        }
        const typedMap = map as Map
        const debouncedDoubleClickHandler = debounce((event: MapMouseEvent) => {
            decoderRef.current!.geocode({location: event.latLng}, (results, status: google.maps.GeocoderStatus) => {
                setLoadingState(false)

                const result = results?.length ? results[0] : null
                if (status == google.maps.GeocoderStatus.OK && !!result) {
                    setLocalAddress(result.formatted_address)
                    onAddressChange(result.formatted_address)
                    onError(null)
                } else {
                    onError('Invalid address')
                }
            })
        }, 500)
        const debouncedAddressRequest = debounce(() => {
            decoderRef.current!.geocode({address}, (results, status: google.maps.GeocoderStatus) => {
                setLoadingState(false)

                const result = results?.length ? results[0] : null
                if (status == google.maps.GeocoderStatus.OK && !!result) {
                    markerRef.current!.setPosition(result.geometry.location)
                    map.setCenter(result.geometry.location)
                    onError(null)
                } else {
                    onError('Invalid address')
                }
            })
        }, 1500)
        const dblClickCancel = typedMap.addListener('dblclick', (event: MapMouseEvent) => {
            markerRef.current!.setPosition(event.latLng)
            map.setCenter(event.latLng)

            setLoadingState(true)
            debouncedDoubleClickHandler(event)
        })

        if (address !== localAddress) {
            setLoadingState(true)
            debouncedAddressRequest()
        }

        return () => {
            dblClickCancel.remove()
            debouncedAddressRequest.cancel()
            debouncedDoubleClickHandler.cancel()
        }
    }, [map, google, address])

    const baseClasses = classNames(styles.base, className, {
        [styles.base__disabled]: isLoading,
    })

    return (
        <div className={baseClasses} ref={mapRef}/>
    )
})
