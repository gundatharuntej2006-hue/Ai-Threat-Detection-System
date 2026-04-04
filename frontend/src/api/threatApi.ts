const BASE_URL = "http://localhost:5000";

export interface ThreatInput {
  duration: number;
  protocol_type: number;
  service: number;
  flag: number;
  src_bytes: number;
  dst_bytes: number;
  land: number;
  wrong_fragment: number;
  urgent: number;
  hot: number;
  num_failed_logins: number;
  logged_in: number;
  num_compromised: number;
  root_shell: number;
  su_attempted: number;
  num_root: number;
  num_file_creations: number;
  num_shells: number;
  num_access_files: number;
  num_outbound_cmds: number;
  is_host_login: number;
  is_guest_login: number;
  count: number;
  srv_count: number;
  serror_rate: number;
  srv_serror_rate: number;
  rerror_rate: number;
  srv_rerror_rate: number;
  same_srv_rate: number;
  diff_srv_rate: number;
  srv_diff_host_rate: number;
  dst_host_count: number;
  dst_host_srv_count: number;
  dst_host_same_srv_rate: number;
  dst_host_diff_srv_rate: number;
  dst_host_same_src_port_rate: number;
  dst_host_srv_diff_host_rate: number;
  dst_host_serror_rate: number;
  dst_host_srv_serror_rate: number;
  dst_host_rerror_rate: number;
  dst_host_srv_rerror_rate: number;
}

export interface ThreatResponse {
  threat: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  probabilities: { LOW: number; MEDIUM: number; HIGH: number };
}

export async function predictThreat(input: ThreatInput): Promise<ThreatResponse> {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
