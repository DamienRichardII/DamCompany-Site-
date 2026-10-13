"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Eye, RotateCcw, X } from "lucide-react";
import styles from "./Configurator.module.css";
import form from "./form/Form.module.css";
import { LoyaltyCard } from "./LoyaltyCard";
import { PreviewPanel } from "./PreviewPanel";
import { ConfirmDialog, Modal } from "./Modal";
import { IdentityStep } from "./steps/IdentityStep";
import { AppearanceStep } from "./steps/AppearanceStep";
import { ProgramStep } from "./steps/ProgramStep";
import { RecapStep } from "./steps/RecapStep";
import { STEPS, configSchema, defaultConfig, progressLabel, toPreviewModel, type LoyaltyConfig, type StepId } from "@/lib/loyalty/config";
import { clearDraft, loadDraft, saveDraft, type StorageLike } from "@/lib/loyalty/draft";
import type { LoyaltyPricing } from "@/lib/loyalty/pricing";

type ConfiguratorProps = {
  activationEnabled: boolean;
  pricing: LoyaltyPricing | null;
};

function getStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null; // navigation privée / stockage bloqué
  }
}

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const formatDay = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" }).format(new Date(iso));

export function Configurator({ activationEnabled, pricing }: ConfiguratorProps) {
  const methods = useForm<LoyaltyConfig>({
    resolver: zodResolver(configSchema),
    defaultValues: defaultConfig(),
    mode: "onChange",
  });
  const { control, trigger, getValues, reset } = methods;
  const values = useWatch({ control }) as LoyaltyConfig;
  const model = toPreviewModel(values);

  const [step, setStep] = useState<StepId>("identity");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [storageOk, setStorageOk] = useState(true);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const userNavigated = useRef(false);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  /* ---------- Restauration du brouillon (une seule fois, après hydratation) ---------- */
  useEffect(() => {
    // Différé d'un tick : le stockage navigateur n'existe qu'après hydratation.
    const timer = window.setTimeout(() => {
      const storage = getStorage();
      if (!storage) {
        setStorageOk(false);
      } else {
        const restored = loadDraft(storage);
        if (restored) {
          reset(restored.config);
          setStep(restored.step);
          setSavedAt(restored.savedAt);
          setNotice(
            `Brouillon restauré — dernière modification le ${formatDay(restored.savedAt)} à ${formatTime(restored.savedAt)}.${
              restored.repaired ? " Certains champs invalides ont été remis à leur valeur par défaut." : ""
            }`
          );
        }
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [reset]);

  /* ---------- Enregistrement automatique (anti-rebond) ---------- */
  useEffect(() => {
    if (!hydrated) return;
    const storage = getStorage();
    if (!storage) return;
    const timer = window.setTimeout(() => {
      const at = saveDraft(storage, getValues(), step);
      if (at) setSavedAt(at);
      else setStorageOk(false);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [values, step, hydrated, getValues]);

  /* ---------- Focus sur le titre d'étape après navigation utilisateur ---------- */
  useEffect(() => {
    if (!userNavigated.current) return;
    headingRef.current?.focus({ preventScroll: true });
    const top = panelRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 60 || top > window.innerHeight * 0.6) {
      panelRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
  }, [step]);

  const goTo = useCallback(
    async (target: StepId) => {
      const targetIndex = STEPS.findIndex((s) => s.id === target);
      let destination = targetIndex;
      if (targetIndex > stepIndex) {
        // Avancer : chaque étape traversée doit être valide ; sinon on s'arrête sur la première invalide.
        for (let i = stepIndex; i < targetIndex; i += 1) {
          const fields = STEPS[i].fields as readonly string[];
          const ok = fields.length === 0 || (await trigger(fields as never, { shouldFocus: true }));
          if (!ok) {
            destination = i;
            break;
          }
        }
      }
      if (destination === stepIndex) return;
      userNavigated.current = true;
      setDirection(destination > stepIndex ? 1 : -1);
      setStep(STEPS[destination].id);
    },
    [stepIndex, trigger]
  );

  const next = () => goTo(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)].id);
  const previous = () => goTo(STEPS[Math.max(stepIndex - 1, 0)].id);

  const confirmReset = () => {
    const storage = getStorage();
    if (storage) clearDraft(storage);
    reset(defaultConfig());
    userNavigated.current = true;
    setDirection(-1);
    setStep("identity");
    setSavedAt(null);
    setNotice("Configuration réinitialisée. Vous repartez de zéro.");
    setResetOpen(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <FormProvider {...methods}>
        <div className={styles.root}>
          {/* Aperçu compact (mobile / tablette) */}
          <div className={styles.compact}>
            <div className={styles.thumb} aria-hidden="true">
              <LoyaltyCard model={model} tilt={false} badge={false} />
            </div>
            <div className={styles.compactText}>
              <span className={styles.compactName}>{model.name}</span>
              <span className={styles.compactMeta}>{progressLabel(model)} · aperçu</span>
            </div>
            <button type="button" className={`${form.btn} ${form.btnDark} ${form.btnSmall}`} onClick={() => setPreviewOpen(true)}>
              <Eye size={15} aria-hidden="true" /> Aperçu
            </button>
          </div>

          <div className={styles.layout}>
            <section className={styles.panel} aria-label="Réglages de la carte">
              <header className={styles.head}>
                <nav aria-label="Étapes du configurateur">
                  <ol className={styles.stepper}>
                    {STEPS.map((s, index) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          className={styles.stepButton}
                          aria-current={s.id === step ? "step" : undefined}
                          data-done={index < stepIndex}
                          onClick={() => void goTo(s.id)}
                        >
                          <span className={styles.stepNum}>{index < stepIndex ? <Check size={13} aria-hidden="true" /> : index + 1}</span>
                          <span className={styles.stepLabel}>{s.label}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
                <p className={styles.saved} aria-live="polite">
                  {!storageOk ? (
                    "Enregistrement local indisponible"
                  ) : savedAt ? (
                    <>
                      <motion.span key={savedAt} className={styles.savedIcon} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <Check size={12} aria-hidden="true" />
                      </motion.span>
                      Brouillon enregistré à {formatTime(savedAt)}
                    </>
                  ) : (
                    "Enregistrement automatique du brouillon"
                  )}
                </p>
              </header>

              {notice ? (
                <div className={styles.notice} role="status">
                  <span>{notice}</span>
                  <button type="button" className={styles.noticeClose} onClick={() => setNotice(null)} aria-label="Masquer le message">
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              ) : null}

              <div ref={panelRef} className={styles.body}>
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: direction * 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -18 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <h2 ref={headingRef} tabIndex={-1} className={styles.srHeading}>
                      Étape {stepIndex + 1} sur {STEPS.length} : {STEPS[stepIndex].label}
                    </h2>
                    {step === "identity" && <IdentityStep />}
                    {step === "appearance" && <AppearanceStep />}
                    {step === "program" && <ProgramStep />}
                    {step === "recap" && <RecapStep onEdit={(target) => void goTo(target)} activationEnabled={activationEnabled} pricing={pricing} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              <footer className={styles.nav}>
                <button type="button" className={`${form.btn} ${form.btnQuiet}`} onClick={() => setResetOpen(true)}>
                  <RotateCcw size={14} aria-hidden="true" /> Réinitialiser
                </button>
                <div className={styles.navMain}>
                  {stepIndex > 0 ? (
                    <button type="button" className={`${form.btn} ${form.btnGhost}`} onClick={() => void previous()}>
                      <ArrowLeft size={15} aria-hidden="true" /> Précédent
                    </button>
                  ) : null}
                  {stepIndex < STEPS.length - 1 ? (
                    <button type="button" className={`${form.btn} ${form.btnPrimary}`} onClick={() => void next()}>
                      {STEPS[stepIndex + 1].id === "recap" ? "Voir le récapitulatif" : "Suivant"} <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </footer>
            </section>

            <aside className={styles.preview} aria-label="Aperçu en direct">
              <PreviewPanel model={model} />
            </aside>
          </div>

          <Modal open={previewOpen} title="Aperçu de votre carte" onClose={() => setPreviewOpen(false)} variant="sheet">
            <PreviewPanel model={model} />
          </Modal>

          <ConfirmDialog
            open={resetOpen}
            title="Réinitialiser la carte ?"
            description="Toute la configuration en cours (identité, logo, couleurs, programme) sera effacée de ce navigateur. Cette action est définitive."
            confirmLabel="Tout effacer"
            onConfirm={confirmReset}
            onCancel={() => setResetOpen(false)}
          />
        </div>
      </FormProvider>
    </MotionConfig>
  );
}
