// import styles
import './Loading.scss';

export function Loading() {
  return (
    <div data-test="loading-indicator" className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
