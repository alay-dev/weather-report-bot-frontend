"use client";

import { googleClientId } from "@/config/api";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export function AuthenticationProvider({ children }: { children?: ReactNode }) {
  return (
    <GoogleOAuth2Provider clientId={googleClientId}>
      {children}
    </GoogleOAuth2Provider>
  );
}

/******** Google OAuth2 Provider *********/

export type GoogleOAuth2Context = {
  clientId: string;
  isLoaded: boolean;
};

export const GoogleOAuth2Context = createContext<
  GoogleOAuth2Context | undefined
>(undefined);
GoogleOAuth2Context.displayName = "GoogleOAuth2Context";

export function GoogleOAuth2Provider({
  clientId,
  children,
}: {
  clientId: string;
  children?: ReactNode;
}) {
  const isLoaded = useLoadGSIScript();
  const value = { clientId, isLoaded };
  return (
    <GoogleOAuth2Context.Provider value={value}>
      {children}
    </GoogleOAuth2Context.Provider>
  );
}

export function useGoogleOAuth2() {
  const context = useContext(GoogleOAuth2Context);
  if (!context)
    throw new Error("Please wrap your component in Authentication Provider");
  return context;
}

/**
 * GSI Script Loader - Used to load the google client javascript sdk programtically
 * @param {Object} options The options accepted by this function
 * @param {string} options.nonce Specify if the google script should have the nonce property
 * @param {Function} options.onSuccess The success callback when the script is loaded without any error
 * @param {Function} options.onError The error callback when the script is not loaded due to any error
 * @returns {boolean} true if the script has been loaded successfully, false otherwise
 */
export function useLoadGSIScript(options?: {
  nonce?: string;
  onSuccess?: () => void;
  onError?: () => void;
}): boolean {
  const [hasScriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.defer = true;
    script.nonce = options?.nonce;
    script.onload = () => {
      setScriptLoaded(true);
      options?.onSuccess?.();
    };
    script.onerror = () => {
      setScriptLoaded(false);
      options?.onError?.();
    };

    const div = document.createElement("div");
    div.id = "fb-root";

    document.body.appendChild(script);
    document.body.appendChild(div);
    return () => {
      document.body.removeChild(script);
    };
  }, [options?.nonce]);

  return hasScriptLoaded;
}

/******** End Google OAuth2 Provider ********/

/******** Facebook OAuth2 Provider *********/

export type FacebookOAuth2Context = {
  appId: string;
  isLoaded: boolean;
};

export const FacebookOAuth2Context = createContext<
  FacebookOAuth2Context | undefined
>(undefined);
FacebookOAuth2Context.displayName = "FacebookOAuth2Context";

export function FacebookOAuth2Provider({
  appId,
  children,
}: {
  appId: string;
  children?: ReactNode;
}) {
  const isLoaded = useLoadFacebookScript({ appId });
  const value = { appId, isLoaded };
  return (
    <FacebookOAuth2Context.Provider value={value}>
      {children}
    </FacebookOAuth2Context.Provider>
  );
}

export function useFacebookOAuth2() {
  const context = useContext(FacebookOAuth2Context);
  if (!context)
    throw new Error("Please wrap your component in Authentication Provider");
  return context;
}

/**
 * Facebook Script Loader - Used to load the facebook client javascript sdk programtically
 * @param {Object} options The options accepted by this function
 * @param {string} options.debug Specify if the facebook script should be the test / debug version
 * @param {Function} options.onSuccess The success callback when the script is loaded without any error
 * @param {Function} options.onError The error callback when the script is not loaded due to any error
 * @returns {boolean} true if the script has been loaded successfully, false otherwise
 */
export function useLoadFacebookScript(options: {
  appId: string;
  debug?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
}): boolean {
  const [hasScriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");

    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = options.debug
      ? `https://connect.facebook.net/en_US/sdk/debug.js`
      : `https://connect.facebook.net/en_US/sdk.js`;

    script.onload = () => {
      setScriptLoaded(true);
      options.onSuccess?.();
    };
    script.onerror = () => {
      setScriptLoaded(false);
      options.onError?.();
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const _window = window as any;
    if (!_window || !hasScriptLoaded) return;
    _window.fbAsyncInit = () => {
      _window?.FB?.init({
        version: "v17.0",
        xfbml: false,
        cookie: false,
        localStorage: true,
        appId: options.appId,
      });
    };
  }, [hasScriptLoaded]);

  return hasScriptLoaded;
}

/******** End Facebook OAuth2 Provider ********/

/******** Apple OAuth2 Provider *********/

export type AppleOAuth2Context = {
  clientId: string;
  isLoaded: boolean;
  redirectUrl: string;
};

export const AppleOAuth2Context = createContext<AppleOAuth2Context | undefined>(
  undefined
);
AppleOAuth2Context.displayName = "AppleOAuth2Context";

export function AppleOAuth2Provider({
  clientId,
  redirectUrl,
  children,
}: {
  clientId: string;
  redirectUrl: string;
  children?: ReactNode;
}) {
  const isLoaded = useLoadAppleScript();
  const value = { clientId, redirectUrl, isLoaded };
  return (
    <AppleOAuth2Context.Provider value={value}>
      {children}
    </AppleOAuth2Context.Provider>
  );
}

export function useAppleOAuth2() {
  const context = useContext(AppleOAuth2Context);
  if (!context)
    throw new Error("Please wrap your component in Authentication Provider");
  return context;
}

/**
 * Apple Script Loader - Used to load the apple client javascript sdk programtically
 * @param {Object} options The options accepted by this function
 * @param {string} options.debug Specify if the apple script should be the test / debug version
 * @param {Function} options.onSuccess The success callback when the script is loaded without any error
 * @param {Function} options.onError The error callback when the script is not loaded due to any error
 * @returns {boolean} true if the script has been loaded successfully, false otherwise
 */
export function useLoadAppleScript(options?: {
  debug?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
}): boolean {
  const [hasScriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");

    script.async = true;
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

    script.onload = () => {
      setScriptLoaded(true);
      options?.onSuccess?.();
    };
    script.onerror = () => {
      setScriptLoaded(false);
      options?.onError?.();
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return hasScriptLoaded;
}

/******** End Apple OAuth2 Provider *********/
