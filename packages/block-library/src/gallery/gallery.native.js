/**
 * External dependencies
 */
import { View } from 'react-native';
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import GalleryImage from './gallery-image';
import { defaultColumnsNumber } from './shared';
import styles from './gallery-styles.scss';
import Tiles from './tiles';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Caption } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

const TILE_SPACING = 15;

// we must limit displayed columns since readable content max-width is 580px
const MAX_DISPLAYED_COLUMNS = 4;
const MAX_DISPLAYED_COLUMNS_MOBILE = 2;

export const Gallery = ( props ) => {
	const [ isCaptionSelected, setIsCaptionSelected ] = useState( false );

	const {
		clientId,
		selectedImage,
		mediaPlaceholder,
		onBlur,
		onMoveBackward,
		onMoveForward,
		onRemoveImage,
		onSelectImage,
		onSetImageAttributes,
		onFocusGalleryCaption,
		attributes,
		isSelected,
		isMobile,
		onFocus,
	} = props;

	const {
		columns = defaultColumnsNumber( attributes ),
		imageCrop,
		images,
	} = attributes;

	// limit displayed columns based on viewport width
	const displayedColumns = isMobile ?
		Math.min( columns, MAX_DISPLAYED_COLUMNS_MOBILE ) :
		Math.min( columns, MAX_DISPLAYED_COLUMNS );

	const selectImage = ( index ) => {
		return () => {
			if ( isCaptionSelected ) {
				setIsCaptionSelected( false );
			}
			// we need to fully invoke the curried function here
			onSelectImage( index )();
		};
	};

	const focusGalleryCaption = () => {
		if ( ! isCaptionSelected ) {
			setIsCaptionSelected( true );
		}
		onFocusGalleryCaption();
	};

	return (
		<View>
			<Tiles
				columns={ displayedColumns }
				spacing={ TILE_SPACING }
				style={ isSelected ? styles.galleryTilesContainerSelected : undefined }
			>
				{ images.map( ( img, index ) => {
					/* translators: %1$d is the order number of the image, %2$d is the total number of images. */
					const ariaLabel = sprintf( __( 'image %1$d of %2$d in gallery' ), ( index + 1 ), images.length );

					return (
						<GalleryImage
							key={ img.id || img.url }
							url={ img.url }
							alt={ img.alt }
							id={ img.id }
							isCropped={ imageCrop }
							isFirstItem={ index === 0 }
							isLastItem={ ( index + 1 ) === images.length }
							isSelected={ isSelected && selectedImage === index }
							isBlockSelected={ isSelected }
							onMoveBackward={ onMoveBackward( index ) }
							onMoveForward={ onMoveForward( index ) }
							onRemove={ onRemoveImage( index ) }
							onSelect={ selectImage( index ) }
							onSelectBlock={ onFocus }
							setAttributes={ ( attrs ) => onSetImageAttributes( index, attrs ) }
							caption={ img.caption }
							aria-label={ ariaLabel }
						/>
					);
				} ) }
			</Tiles>
			{ mediaPlaceholder }
			<Caption
				clientId={ clientId }
				isSelected={ isCaptionSelected }
				accessible={ true }
				accessibilityLabelCreator={ ( caption ) =>
					isEmpty( caption ) ?
					/* translators: accessibility text. Empty gallery caption. */
						( 'Gallery caption. Empty' ) :
						sprintf(
						/* translators: accessibility text. %s: gallery caption. */
							__( 'Gallery caption. %s' ),
							caption )
				}
				onFocus={ focusGalleryCaption }
				onBlur={ onBlur } // always assign onBlur as props
			/>
		</View>
	);
};

export default Gallery;
