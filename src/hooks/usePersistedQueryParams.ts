import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { UrlParamsState } from "../schemas/urlParams/paramSchema";

export function usePersistedQueryParams() {
  const location = useLocation();
  const setUrlParams = useSetRecoilState(UrlParamsState);

  // Guarda search anterior
  const prevSearchRef = useRef(sessionStorage.getItem("lastSearch") || location.search);

  // Inicializa o estado do Recoil ao montar
  useLayoutEffect(() => {
    setUrlParams(prevSearchRef.current);
  }, [setUrlParams]);

  // Atualiza o Recoil e o sessionStorage sempre que muda a rota ou query
  useLayoutEffect(() => {
    const pathnameChanged = location.pathname !== prevSearchRef.current.pathname;

    if (pathnameChanged) {
      // Mantém search anterior se a nova rota não tiver query
      setUrlParams(prevSearchRef.current);
    } else {
      // Atualiza com o search atual se estiver na mesma rota
      setUrlParams(location.search);
      prevSearchRef.current = location.search;
    }

    // Sempre persiste no sessionStorage
    sessionStorage.setItem("lastSearch", prevSearchRef.current);
  }, [location.pathname, location.search, setUrlParams]);
}
