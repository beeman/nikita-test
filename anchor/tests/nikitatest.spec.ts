import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Nikitatest} from '../target/types/nikitatest'
import '@types/jest';

describe('nikitatest', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Nikitatest as Program<Nikitatest>

  const nikitatestKeypair = Keypair.generate()

  it('Initialize Nikitatest', async () => {
    await program.methods
      .initialize()
      .accounts({
        nikitatest: nikitatestKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([nikitatestKeypair])
      .rpc()

    const currentCount = await program.account.nikitatest.fetch(nikitatestKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Nikitatest', async () => {
    await program.methods.increment().accounts({ nikitatest: nikitatestKeypair.publicKey }).rpc()

    const currentCount = await program.account.nikitatest.fetch(nikitatestKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Nikitatest Again', async () => {
    await program.methods.increment().accounts({ nikitatest: nikitatestKeypair.publicKey }).rpc()

    const currentCount = await program.account.nikitatest.fetch(nikitatestKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Nikitatest', async () => {
    await program.methods.decrement().accounts({ nikitatest: nikitatestKeypair.publicKey }).rpc()

    const currentCount = await program.account.nikitatest.fetch(nikitatestKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set nikitatest value', async () => {
    await program.methods.set(42).accounts({ nikitatest: nikitatestKeypair.publicKey }).rpc()

    const currentCount = await program.account.nikitatest.fetch(nikitatestKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the nikitatest account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        nikitatest: nikitatestKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.nikitatest.fetchNullable(nikitatestKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
