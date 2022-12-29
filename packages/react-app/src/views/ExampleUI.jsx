/* eslint-disable jsx-a11y/accessible-emoji */
//import { Button, Card,  List, Row, Col, Descriptions, Input, Tag } from "antd";
import { ethers } from "ethers";
import React, { useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Row, Col, Tag, Descriptions, } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { Address, Balance, EtherInput, AddressInput } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { Alert } from "antd";

export default function ExampleUI({
  setPurposeEvents,
  address,
  mainnetProvider,
  userProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  writeContracts,
readContracts,
processedDataSet,
contractAddress,
blockExplorer
}) {
  const [amount, setAmount] = useState();
  const [facetAddress, setFacetAddress] = useState();
  const [action, setAction] = useState();


    const [ toAddress, setToAddress ] = useState();
    const [ toAddKickAddress, setToAddKickAddress ] = useState();
    const [ memberInfo, setMemberInfo ] = useState();
    const [ memberReason, setMemberReason ] = useState();
    const [ showMemberInfo, setShowMemberInfo ] = useState("none");

    const [ processProposalId, setProcessProposalId ] = useState();
    const [ proposalSubmitDetails, setProposalSubmitDetails ] = useState();
//    const [ amount, setAmount ] = useState();

    const [ payoutResult, setPayoutResult ] = useState();
    const [ payoutClicked, setPayoutClicked ] = useState("none");

  const signer = userProvider.getSigner();

  const data = writeContracts.DeFiFacet.interface.encodeFunctionData("zappify", [parseEther("1000")]);

  function handleActionChange(evt) {
    const action = evt.target.value.toLowerCase();
    console.log(action);
    let actionVal;
    if (action === "add") {
      actionVal = 0;
    } else if (action === 'replace') {
      actionVal = 1;
    } else if (action === "remove") {
      actionVal = 2;
    }
    setAction(actionVal);
  }

    async function voteYes(proposalId) {
        const result = await tx(writeContracts.PowDAO.submitVote(proposalId, 1));
        console.log(result)
    }

    async function voteNo(proposalId) {
        const result = await tx(writeContracts.PowDAO.submitVote(proposalId, 2));
        console.log(result)
    }




  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
              <Alert
          message={"⚠️ Facet Deployment"}
          description={(
            <div>
              Deploy the facet you want to upgrade through scaffold
            </div>
          )}
          type="error"
          closable={false}
        />
      <a href = 'https://faucet.metamask.io/'><b>Get Ropsten ETH here</b></a>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Zap with DeFi Facet</h2>
        {/* <h4>purpose: {purpose}</h4> */}
        <Divider />
        <div style={{ margin: 8 }}>
          <EtherInput
            price={price}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
          <br />
          <br />
          <Button
            onClick={() => {
              /* look how you call setPurpose on your contract: */
              tx(
                signer.sendTransaction({
                  to: writeContracts.Diamond.address,
                  data: data,
                  value: parseEther(amount),
                }),
              );
            }}
          >
            Zap with Aave Uniswap Market
          </Button>
        </div>
        <Divider />
        <h2>Upgrade Diamond Facet</h2>
        {/* upgrades the defi facet only currently for demo purposes */}
        <Divider />
        <div style={{ margin: 8 }}>
        
          <AddressInput
            autoFocus
            ensProvider={mainnetProvider}
            placeholder="New Facet Address"
            value={facetAddress}
            onChange={setFacetAddress}
          />
          <br />
          <h5>Select Upgrade Action</h5>
          <br />

          <select onChange={handleActionChange}>
            <option>Select Action</option>
            <option>Add</option>
            <option>Replace</option>
            <option>Remove</option>
          </select>
          <br />
          <br />

          {facetAddress && (
            <Button
              onClick={() => {
                const signatures = [];
                Object.keys(writeContracts.DeFiFacet.interface.functions).map(key => {
                  signatures.push(writeContracts.DeFiFacet.interface.getSighash(key));
                });

                const diamondCutParams = [[facetAddress, 0, signatures]];

                /* look how you call setPurpose on your contract: */
                tx(
                  writeContracts.DiamondCutFacet.diamondCut(
                    diamondCutParams,
                    "0x0000000000000000000000000000000000000000",
                    "0x",
                  ),
                );
              }}
            >
              Upgrade
            </Button>
          )}
        </div>
        <Divider />
        Your Address:
        <Address value={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider />
        ENS Address Example:
        <Address
          value={"0x34aA3F359A9D614239015126635CE7732c18fDF3"} /* this will show as austingriffith.eth */
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
        {/* use formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? formatEther(yourLocalBalance) : "..."}</h2>
        OR
        <Balance address={address} provider={localProvider} dollarMultiplier={price} />
        <Divider />
        {/* use formatEther to display a BigNumber: */}
        <h2>Your Balance: {yourLocalBalance ? formatEther(yourLocalBalance) : "..."}</h2>
        <Divider />
        {/* Your Contract Address:
        <Address
            value={readContracts?readContracts.YourContract.address:readContracts}
            ensProvider={mainnetProvider}
            fontSize={16}
        /> */}
        <Divider />
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      {/* <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <h2>Events:</h2>
        <List
          bordered
          dataSource={setPurposeEvents}
          renderItem={item => {
            return (
              <List.Item key={item.blockNumber + "_" + item.sender + "_" + item.purpose}>
                <Address value={item[0]} ensProvider={mainnetProvider} fontSize={16} /> =>
                {item[1]}
              </List.Item>
            );
          }}
        />
      </div> */}
//
        <div style={{margin:"0px", margin:"0px"}}>

            <Row justify="center">
                <Col span={6} style={{margin:"24px"}}>
                    <Card bordered title="Members">
                        <AddressInput
                            autoFocus
                            ensProvider={mainnetProvider}
                            placeholder="Enter address"
                            value={toAddress}
                            onChange={setToAddress}
                        />
                        <Button onClick={ async ()=>{
                            console.log(toAddress)
                            const result = await readContracts.PowDAO.members(toAddress);
                            setMemberInfo(parseInt(result[0]))
                            console.log(parseInt(result[0]))
                            setShowMemberInfo("block")
                        }}>
                            Search
                        </Button>
                        <div style={{fontSize:"16px", margin:"12px", display:showMemberInfo}} >
                        {memberInfo == 1 ? toAddress+" is apart of the PowDAO 👍" : "This address is NOT apart of the PowDAO"}
                        </div>
                    </Card >
                </Col>

                <Col span={6} style={{margin:"24px"}}>
                    <Card bordered title="Add/Kick Members">
                        <AddressInput
                            autoFocus
                            ensProvider={mainnetProvider}
                            placeholder="Enter address"
                            value={toAddKickAddress}
                            onChange={setToAddKickAddress}
                        />
                        <div style={{margin:"8px"}}>
                        <Input
                        onChange={ (e) =>{
                            setMemberReason(e.target.value)
                        }}
                        placeholder="Enter details."
                        />
                        </div>
                        <Button onClick={ async ()=>{
                            const result = await tx (writeContracts.PowDAO.addMember(toAddKickAddress, memberReason));
                            console.log(result)
                        }}>
                            Add
                        </Button>
                        <Button onClick={ async ()=>{
                            const result = await tx (writeContracts.PowDAO.kickMember(toAddKickAddress, memberReason));
                            console.log(result)
                        }}>
                            Kick
                        </Button>
                    </Card >
                </Col>

            </Row>

            <Row justify="center" style={{margin:"18px"}}>
                <Col span={20}>
                    <Card title="Vote">
                        <List
                        dataSource={processedDataSet} // Only setting this data on proposal submit, never updated when proposal is processed.
                        header={<div >Proposal ID  //  Proposal Details</div>}
                        renderItem={item => {
                            return (
                                <List.Item key={item.args["proposalId"]} actions={[
                                    <Button onClick={()=>{voteYes(parseInt(item.args["proposalId"]))}}>
                                        Yes
                                    </Button>,
                                    <Button onClick={()=>{voteNo(parseInt(item.args["proposalId"]))}}>
                                        No
                                    </Button>
                                ]}>
                                    <div style={{margin:"8px"}}>
                                        ID: {parseInt(item.args["proposalId"])}
                                    </div>
                                    <Address address={item.args["proposer"]} ensProvider={mainnetProvider} fontSize={18}/>
                                    <div style={{margin:"8px"}}>
                                        {item.args["details"]}
                                    </div>
                                    <div style={{margin:"8px"}}>
                                        {ethers.utils.formatEther(""+item.args["paymentRequested"])} Ξ
                                    </div>
                                    <div style={{margin:"8px"}}>
                                        {item.args['flags'][4] || item.args['flags'][5] ?
                                            item.args['flags'][4]? <Tag color="cyan">Member Add</Tag> : <Tag color="red">Member Kick</Tag>
                                            :
                                            <Tag color="orange">Work</Tag>}
                                    </div>
                                </List.Item>
                            );
                        }}
                        />
                    </Card >
                </Col>
            </Row>

            <Row justify="center" style={{margin:"24px"}}>
                <Col span={10}>
                    <Card title="Create Proposal/Request">
                        <Input
                        onChange={(e)=>{
                            setProposalSubmitDetails(e.target.value)
                        }}
                        placeholder="Enter proposal details."
                        />
                        <div >
                        <EtherInput
                        price={price}
                        value={amount}
                        placeholder="Enter amount"
                        onChange={value => {
                        setAmount(value);
                        }}
                        />
                        </div>

                        <Button onClick={ async ()=>{
                            const value = ethers.utils.parseEther("" + amount);
                            const result = await tx( writeContracts.PowDAO.submitProposal(value, proposalSubmitDetails) )
                        }}>
                        Submit Proposal
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Row justify="center" style={{margin:"32px"}}>
                <Col span={4}>
                    <Card title="Process Proposal">
                        <Input
                        style={{width:"140px"}}
                        onChange={(e)=>{
                            setProcessProposalId(e.target.value)
                        }}
                        placeholder="Enter Propsal ID"/>
                        <Button onClick={ async ()=>{
                            const result = await tx(writeContracts.PowDAO.processProposal(processProposalId))
                        }}>
                        Process
                        </Button>
                    </Card>
                </Col>
                <Col span={1}></Col>
                <Col >

                    <Card >
                        <div >
                            <Button onClick={ async ()=>{
                            const result = await tx(writeContracts.PowDAO.payout(address))
                            console.log(parseInt(result))
                            setPayoutResult(result)
                            setPayoutClicked("block")
                        }}>
                                Check Payout
                            </Button>
                            <div style={{fontSize:"16px", margin:"12px", display:payoutClicked}} >
                                {payoutResult > 0 ? ethers.utils.formatEther(""+payoutResult)+" Ξ" : "No payout is currently available."}
                            </div>
                        </div>
                        <Button onClick={ async ()=>{
                            const result = await tx(writeContracts.PowDAO.getPayout(address))
                        }}
                        style={{margin:"4px"}}>
                            Get Paid
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Row justify="center" style={{margin:"8px", fontSize:"18px"}}>
                To deposit into the DAO, send funds to the smart contract! 🔒
            </Row>
            <Row justify="center" style={{margin:"0px", fontSize:"18px"}}>
            Etherscan Link:
            </Row>

            <Row justify="center">
                <div style={{fontSize:"16px"}}>

                    <a href={"https://etherscan.io/address/"+contractAddress} target="blank">
                        <Address
                            address={contractAddress}
                            ensProvider={mainnetProvider}
                            blockExplorer={blockExplorer}
                            fontSize={18}
                        />
                    </a>
                </div>
            </Row>

        </div>
//

      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        <Card>
          Check out all the{" "}
          <a
            href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            📦 components
          </a>
        </Card>

        <Card style={{ marginTop: 32 }}>
          <div>
            There are tons of generic components included from{" "}
            <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
              🐜 ant.design
            </a>{" "}
            too!
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary">Buttons</Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <SyncOutlined spin /> Icons
          </div>

          <div style={{ marginTop: 8 }}>
            Date Pickers?
            <div style={{ marginTop: 2 }}>
              <DatePicker onChange={() => {}} />
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Slider range defaultValue={[20, 50]} onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Switch defaultChecked onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{ marginTop: 32 }}>
            <Spin />
          </div>
        </Card>
      </div>
    </div>
  );
}
