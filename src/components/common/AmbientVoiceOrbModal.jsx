import React from "react";
import VoiceAssistant from "./VoiceAssistant";

/**
 * Backward compatibility alias for AmbientVoiceOrbModal.
 * Directly renders the advanced VoiceAssistant.
 */
export default function AmbientVoiceOrbModal(props) {
  return <VoiceAssistant {...props} />;
}
