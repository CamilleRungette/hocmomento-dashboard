import React, {useState, useMemo, forwardRef, useImperativeHandle} from "react";

const ConfirmModal = forwardRef(({content, button, confirmParent}, ref) => {

	const [modalConfig, setModalConfig] = useState({
		class: "modal",
		content: content
	});

	useMemo(()=>{
		setModalConfig({...modalConfig, content})
	}, [content])
	

	useImperativeHandle(ref, () => ({
		showModal(){
			setModalConfig({...modalConfig, class: "modal show"})
		},
		closeModal(){
			setModalConfig({...modalConfig, class: "modal"});
		}
	}));


	//Fonction pour fermer la modal
	const closeModal = () => {
		setModalConfig({...modalConfig, class: "modal"});
	};

	const confirmModal = () => {
		confirmParent();
		closeModal();
	}

	return(
		<div className={`${modalConfig.class}`}>
			<div className="container-relative ">
				<div id="confirm-content" className="confirm-content">
					{modalConfig.content}
					{button ? 
						<div className="btn-div div-confirm">
								<button className="btn-grey" onClick={closeModal}>Non</button>
								<button className="btn-red" onClick={confirmModal} >Oui </button>
						</div>
					:
						<></>
					}
				</div>
			<div className="close-div" onClick={closeModal}></div>
			</div>
		</div>
)})

export default ConfirmModal;
