// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import NikitatestIDL from '../target/idl/nikitatest.json'
import type { Nikitatest } from '../target/types/nikitatest'

// Re-export the generated IDL and type
export { Nikitatest, NikitatestIDL }

// The programId is imported from the program IDL.
export const NIKITATEST_PROGRAM_ID = new PublicKey(NikitatestIDL.address)

// This is a helper function to get the Nikitatest Anchor program.
export function getNikitatestProgram(provider: AnchorProvider) {
  return new Program(NikitatestIDL as Nikitatest, provider)
}

// This is a helper function to get the program ID for the Nikitatest program depending on the cluster.
export function getNikitatestProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Nikitatest program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return NIKITATEST_PROGRAM_ID
  }
}
