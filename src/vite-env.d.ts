/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPPORT_EMAIL?: string;
  /** E.164 digits only, e.g. 918920183166 for +91 8920183166 */
  readonly VITE_SUPPORT_WHATSAPP?: string;
}
