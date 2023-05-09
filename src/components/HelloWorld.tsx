import React from "react";
import {DEFAULT_METHODS, NetworkType, useWalletConnect} from '@cityofzion/wallet-connect-sdk-react'
import {CONST} from "@cityofzion/neon-core";

const networks: Record<NetworkType, {name: string}> = {
    'neo3:mainnet': {
        name: 'MainNet',
    },
    'neo3:testnet': {
        name: 'TestNet',
    },
    'neo3:private': {
        name: 'Private Network',
    },
}

function HelloWorld () {
    const wcSdk = useWalletConnect()
    const [networkType, setNetworkType] = React.useState<NetworkType>('neo3:testnet')

    const connect = async (): Promise<void> => {
        await wcSdk.connect(networkType, [...DEFAULT_METHODS, 'traverseIterator', 'getWalletInfo'])
    }

    const disconnect = async (): Promise<void> => {
        await wcSdk.disconnect()
    }

    const transferGas = async (): Promise<void> => {
        const resp = await wcSdk.invokeFunction({
            invocations: [{
                scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
                operation: 'transfer',
                args: [
                    { type: 'Address', value: wcSdk.getAccountAddress() ?? '' },
                    { type: 'Address', value: 'NbnjKGMBJzJ6j5PHeYhjJDaQ5Vy5UYu4Fv' },
                    { type: 'Integer', value: 100000000 },
                    { type: 'Array', value: [] }
                ]
            }],
            signers: [{ scopes: 1 }]
        })

        console.log(resp)
        window.alert(JSON.stringify(resp, null, 2))
    }

    const transferGasWithExtraFee = async (): Promise<void> => {
        const resp = await wcSdk.invokeFunction({
            invocations: [{
                scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
                operation: 'transfer',
                args: [
                    { type: 'Address', value: wcSdk.getAccountAddress() ?? '' },
                    { type: 'Address', value: 'NbnjKGMBJzJ6j5PHeYhjJDaQ5Vy5UYu4Fv' },
                    { type: 'Integer', value: 100000000 },
                    { type: 'Array', value: [] }
                ]
            }],
            signers: [{ scopes: 1 }],
            extraSystemFee: 1000000,
            extraNetworkFee: 100000
        })

        console.log(resp)
        window.alert(JSON.stringify(resp, null, 2))
    }

    const multiInvokeFailing = async (): Promise<void> => {
        const resp = await wcSdk.invokeFunction({
            invocations: [
                {
                    scriptHash: '0x010101c0775af568185025b0ce43cfaa9b990a2a',
                    operation: 'verify',
                    args: [],
                    abortOnFail: true
                },
                {
                    scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf',
                    operation: 'transfer',
                    args: [
                        { type: 'Address', value: wcSdk.getAccountAddress() ?? '' },
                        { type: 'Address', value: 'NbnjKGMBJzJ6j5PHeYhjJDaQ5Vy5UYu4Fv' },
                        { type: 'Integer', value: 100000000 },
                        { type: 'Array', value: [] }
                    ],
                    abortOnFail: true
                }],
            signers: [{ scopes: 1 }]
        })

        console.log(resp)
        window.alert(JSON.stringify(resp, null, 2))
    }

    const signAndVerify = async (): Promise<void> => {
        if (!wcSdk) return
        const resp = await wcSdk.signMessage({ message: 'Caralho, muleq, o baguiu eh issumermo taix ligado na missão?', version: 2 })

        console.log(resp)
        window.alert(JSON.stringify(resp, null, 2))

        const resp2 = await wcSdk.verifyMessage(resp)

        console.log(resp2)
        window.alert(JSON.stringify(resp2, null, 2))
    }

    const verifyFailling = async (): Promise<void> => {
        const resp2 = await wcSdk.verifyMessage({
            data: '4fe1b478cf76564b2133bdff9ba97d8a360ce36d0511918931cda207c2ce589dfc07ec5d8b93ce7c3b70fc88b676cc9e08f9811bf0d5b5710a20f10c58191bfb',
            messageHex: '010001f05c3733336365623464346538666664633833656363366533356334343938393939436172616c686f2c206d756c65712c206f2062616775697520656820697373756d65726d6f2074616978206c696761646f206e61206d697373e36f3f0000',
            publicKey: '031757edb62014dea820a0b33a156f6a59fc12bd966202f0e49357c81f26f5de34',
            salt: '733ceb4d4e8ffdc83ecc6e35c4498999'
        })

        console.log(resp2)
        window.alert(JSON.stringify(resp2, null, 2))
    }

    const verify = async (): Promise<void> => {
        const resp2 = await wcSdk.verifyMessage({
            publicKey: '031757edb62014dea820a0b33a156f6a59fc12bd966202f0e49357c81f26f5de34',
            data: 'aeb234ed1639e9fcc95a102633b1c70ca9f9b97e9592cc74bfc40cbc7fefdb19ae8c6b49ebd410dbcbeec6b5906e503d528e34cd5098cc7929dbcbbaf23c5d77',
            salt: '052a55a8d56b73b342a8e41da3050b09',
            messageHex: '010001f0a0303532613535613864353662373362333432613865343164613330353062303965794a68624763694f694a49557a49314e694973496e523563434936496b705856434a392e65794a6c654841694f6a45324e444d304e7a63324e6a4d73496d6c68644349364d5459304d7a4d354d5449324d33302e7253315f73735230364c426778744831504862774c306d7a6557563950686d5448477a324849524f4a4f340000'
        })

        console.log(resp2)
        window.alert(JSON.stringify(resp2, null, 2))
    }

    const traverseIterator = async (): Promise<void> => {
        const resp = await wcSdk.testInvoke({
            invocations: [
                {
                    operation: "getAllCandidates",
                    scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
                    args: [],
                },
            ],
            signers: [{ scopes: 1 }],
        });

        const sessionId = resp.session as string;
        const iteratorId = resp.stack[0].id as string;

        const resp2 = await wcSdk.traverseIterator(sessionId, iteratorId, 10);

        console.log(resp2);
        window.alert(JSON.stringify(resp2, null, 2));
    };

    const getWalletInfo = async (): Promise<void> => {
        const resp = await wcSdk.getWalletInfo()

        console.log(resp)
        window.alert(JSON.stringify(resp, null, 2))
    }

    return <div>
        {!wcSdk && <span>Loading...</span>}
        {wcSdk && (<div>
            {!wcSdk.isConnected() && <>
                <select onChange={(e: any) => setNetworkType(e.target.value)}
                        value={networkType}>
                    {Object.keys(networks).map((key) => (<option value={key} key={key}>{networks[key as NetworkType].name}</option>))}
                </select>
                <button onClick={connect}>Connect</button>
            </>}
            {wcSdk.isConnected() && <>
                <button onClick={disconnect}>Disconnect</button>
                <button onClick={transferGas}>Transfer Gas</button>
                <button onClick={transferGasWithExtraFee}>Transfer Gas with Extra fee</button>
                <button onClick={multiInvokeFailing}>Multi Invoke Failing</button>
                <button onClick={signAndVerify}>Sign and Verify Message</button>
                <button onClick={verifyFailling}>Verify Failling</button>
                <button onClick={verify}>Verify Success</button>
                <button onClick={traverseIterator}>Traverse Iterator</button>
                <button onClick={getWalletInfo}>Get Wallet Info</button>
            </>}

        </div>)}
    </div>
}

export default HelloWorld
