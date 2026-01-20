import React from 'react';
import './SettingsModal.css';

interface SettingsModalProps {
    onClose: () => void;
    onReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onReset }) => {
    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <h2>Settings</h2>

                <div className="settings-section">
                    <h3>About</h3>
                    <p><strong>Goose University</strong> v0.1.0</p>
                    <p>A clicker game about a goose running a university.</p>
                    <p>© 2026 Antigravity</p>
                </div>

                <div className="settings-section danger-zone">
                    <h3>Danger Zone</h3>
                    <button className="reset-btn" onClick={() => {
                        if (confirm("Are you sure you want to reset your save? ALL PROGRESS WILL BE LOST.")) {
                            onReset();
                            onClose();
                        }
                    }}>Reset Save Data</button>
                </div>

                <button className="close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};
