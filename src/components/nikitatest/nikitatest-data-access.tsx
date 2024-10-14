'use client'

import {getNikitatestProgram, getNikitatestProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useNikitatestProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getNikitatestProgramId(cluster.network as Cluster), [cluster])
  const program = getNikitatestProgram(provider)

  const accounts = useQuery({
    queryKey: ['nikitatest', 'all', { cluster }],
    queryFn: () => program.account.nikitatest.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['nikitatest', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ nikitatest: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useNikitatestProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useNikitatestProgram()

  const accountQuery = useQuery({
    queryKey: ['nikitatest', 'fetch', { cluster, account }],
    queryFn: () => program.account.nikitatest.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['nikitatest', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ nikitatest: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['nikitatest', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ nikitatest: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['nikitatest', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ nikitatest: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['nikitatest', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ nikitatest: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
