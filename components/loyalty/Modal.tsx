"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** "sheet" : plein écran sur mobile (aperçu). "dialog" : boîte centrée (confirmation). */
  variant?: "dialog" | "sheet";
};

/**
 * Modale basée sur l'élément natif <dialog> : piégeage du focus, fermeture
 * par Échap et restitution du focus gérés par le navigateur.
 */
export function Modal({ open, title, onClose, children, variant = "dialog" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      data-variant={variant}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className={styles.inner}>
        <div className={styles.top}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fermer">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {open ? children : null}
      </div>
    </dialog>
  );
}

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className={styles.description}>{description}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={onCancel} autoFocus>
          Annuler
        </button>
        <button type="button" className={styles.danger} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
