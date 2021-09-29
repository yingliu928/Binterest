import ReactModal from 'react-modal';
import React, { useState } from 'react';
import '../../App.css'
import { useMutation, useQuery } from '@apollo/client';
import queries from '../../queries';

ReactModal.setAppElement("#root");
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        border: '1px solid #28547a',
        borderRadius: '4px'
    }
};

function EditImageModal(props) {
   // const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [image, setImage] = useState(props.image);
    const { loading, error, data } = useQuery(queries.UNSPLASH_IMAGES);
    const [updateImage] = useMutation(queries.UPDATE_IMAGE);
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setImage(null);
        props.handleClose();
    }
 
    
   let {binned} = image
    let newBinStatus = !binned;
    console.log(newBinStatus);
    let imageId;
   
    if (data) {
        var { images } = data;
    }
    if (loading) {
        return <div>loading</div>;
    }
    if (error) {
        return <div>error.message</div>;
    }

    return (
        <div>
            <ReactModal
                name="editModal"
                isOpen={showEditModal}
                contentLabel="Edit Image"
                style={customStyles}
            >
                <form
                    className="form"
                    id="edit-image"
                    onSubmit={(e) => {
                        //console.log(posterName.value)
                        e.preventDefault();
                        updateImage({
                            variables: { 
                                id:image.id,
                                binned: newBinStatus

                            }
                        });
                        
                        
                        setShowEditModal(false);
                        alert('image updated');
                        props.handleClose();
                    }}
                >

                    
           
                        <button className="button add-button" type="submit">Update Image</button>
                </form>
                        <button className="button cancel-button" onClick={handleCloseEditModal}>Cancel</button>

            </ReactModal>


        </div>
    )
}

export default EditImageModal;