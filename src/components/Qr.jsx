import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import ReactToPrint from 'react-to-print';

function QrModal({ show, onClose, value, locations, singleMode }) {
  const componentRef = useRef();

  /**
   * Component to be printed, using forwardRef to access the ref of the component.
   * @param {Object} props - The props passed to the component.
   */
  const ContentToPrint = React.forwardRef((props, ref) => (
    <div ref={ref} className="print-content" style={{ textAlign: 'center', margin: '1rem' }}>
      <h5>{ `QR Code - ${locations[0]?.locationName}`}</h5>
      <div className="row justify-content-center">
        {value.map((val, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body text-center">
                <QRCodeSVG value={String(val)} size={200} />
                <h6>{locations[index]?.locationName || `QR Code ${index + 1}`}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ));

  if (!show) {
    return null;
  }

  return (
    <div className="modal fade show align-items-center" style={{ display: 'block' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{singleMode ? `QR Code - ${locations[0]?.locationName}` : 'All QR Codes'}</h5>
          </div>
          <div className="modal-body">
            <ContentToPrint ref={componentRef} />
          </div>
          <div className="modal-footer">
            <ReactToPrint
              trigger={() => <button type="button" className="btn btn-primary">Print {singleMode ? 'QR Code' : 'All QR Codes'}</button>}
              content={() => componentRef.current}
            />
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrModal;
