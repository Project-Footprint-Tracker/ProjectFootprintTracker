import swal from 'sweetalert';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';

/* global window */

export const scrollToTop = () => {
  window.scroll({ top: 0, left: 0, behavior: 'smooth' });
};

export const updateCallBack = (setShowUpdateForm, setId) => (error) => {
  if (error) {
    swal('Error', error.message, 'error');
  } else {
    swal('Success', 'Updated item', 'success');
    setShowUpdateForm(false);
    setId('');
  }
};

export const removeItCallback = (setShowUpdateForm, setId, setConfirmOpen) => (error) => {
  if (error) {
    swal('Delete failed', error.message, 'error');
  } else {
    swal('Success', 'Delete succeeded', 'success');
  }
  setShowUpdateForm(false);
  setId('');
  setConfirmOpen(false);
};

export const handleCancelWrapper = (setConfirmOpen, setId, setShowUpdateForm) => (event) => {
  event.preventDefault();
  setConfirmOpen(false);
  setId('');
  setShowUpdateForm(false);
};

export const handleConfirmDeleteWrapper = (collectionName, idState, setShowUpdateForm, setId, setConfirmOpen) => () => {
  // console.log('handleConfirmDeleteWrapper', collectionName, idState);
  const instance = idState;
  removeItMethod.call({ collectionName, instance }, removeItCallback(setShowUpdateForm, setId, setConfirmOpen));
};

export const handleDeleteWrapper = (setConfirmOpen, setId) => (event, inst) => {
  event.preventDefault();
  // console.log('handleDelete inst=%o', inst);
  setConfirmOpen(true);
  setId(inst.id);
};

export const handleOpenUpdateWrapper = (setShowUpdateForm, setId) => (evt, inst) => {
  evt.preventDefault();
  // console.log('handleOpenUpdate inst=%o', evt, inst);
  setShowUpdateForm(true);
  setId(inst.id);
  scrollToTop();
};
