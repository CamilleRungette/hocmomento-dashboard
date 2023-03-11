import React, {useState, useMemo, forwardRef, useImperativeHandle} from "react";
import {MdOutlineClose} from "react-icons/md";


const BasicModal = forwardRef(({content}, ref) => {

	const [modalConfig, setModalConfig] = useState({
		class: "modal",
		content: content
	});

	useMemo(()=>{
		setModalConfig({...modalConfig, content})
}, [content])


	//Fonction pour fermer la modal
	const closeModal = (e) => {
		e.preventDefault();
		setModalConfig({...modalConfig, class: "modal"});
	};

	useImperativeHandle(ref, () => ({
		showModal(){
			setModalConfig({...modalConfig, class: "modal show"})
		},
		closeModal(){
			setModalConfig({...modalConfig, class: "modal"});
		}
	}));



	return(
		<div className={`${modalConfig.class}`}>
			<div className="container-relative ">
				<div id="modal-content" className="center gx-card-widget gx-card-profile-sm">
						<button className="btn-no-style close-button pointer" onClick={closeModal}> <MdOutlineClose className="icon" /> </button>
						{modalConfig.content}
				</div>
				<div className="close-div" onClick={(e) => closeModal(e)}></div>
			</div>
		</div>
)})

export default BasicModal;
