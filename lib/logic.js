  /**
   * New script file
   */

  /**
   * New script file
   */

  let ns='org.hack.sagarmala'; 

  async function activateTask(assgn_reg,assgn,next_task,vessel,container){
      var d = new Date();
      var n = d.getTime();

      let assetRegistry = await getAssetRegistry(ns+".Task");

      let participantRegistry = await getParticipantRegistry(ns+'.'+assgn_reg);

      let assignee = await participantRegistry.get(assgn)

      // Get the factory.
      let factory = getFactory();
      let task = factory.newResource(ns, 'Task', 'TASK'+n);
      task.assigneeID=assignee.pID;
      task.assigneeType=assgn_reg;
      task.created_at=d;
      
      if(vessel!=null){
          task.vesselID= vessel.vesselID;
      }if(container!=null){
          task.containerID= container.contID;
      }
      task.transactionId= next_task;

      await assetRegistry.add(task);

      if(vessel!=null){
        let vreg=await getAssetRegistry(ns+".Vessel");
        if(vessel.tasks!=undefined)
        	vessel.tasks.push(task);
        else
        	vessel.tasks=[task];
          
        await vreg.update(vessel);
      }if(container!=null){
        let creg=await getAssetRegistry(ns+".Container");
        if(container.tasks!=undefined)
        	container.tasks.push(task);
        else
        	container.tasks=[task];
        await creg.update(container);
      }
    

  }


  async function checkTaskActiveFunc(tParam,vParam,cParam,aParam){
      let sresult;  
      if(vParam!=null){
          sresult=await query('selectTaskInTransaction',{transactionidParam:tParam,vesselParam:vParam,
                                                     contParam:cParam,assigneeParam:aParam});
      }else{
          sresult=await query('selectContTaskInTransaction',{transactionidParam:tParam,
                                                     contParam:cParam,assigneeParam:aParam});
      }


      if(sresult.length==0){
          return false;
      }else{ 
          return true;
      }
   }


  async function markTaskComplete(tParam,vParam,cParam,aParam) {

      let sresult;  
      if(vParam!=null){
          sresult=await query('selectTaskInTransaction',{transactionidParam:tParam,vesselParam:vParam,
                                                     contParam:cParam,assigneeParam:aParam});
      }else{
          sresult=await query('selectContTaskInTransaction',{transactionidParam:tParam,
                                                     contParam:cParam,assigneeParam:aParam});
      }

      if(sresult.length>0){
          let assetRegistry = await getAssetRegistry(ns+".Task");
          sresult[0].finished=true;
          sresult[0].completed_at=new Date();
          await assetRegistry.update(sresult[0]);
      }else{
          throw new Error('Not permitted:unknown');
      }
  }


  async function checkTaskCompleteFunc(tParam,vParam,cParam){
      let sresult=await query('checkTaskComplete',{transactionidParam:tParam, vesselParam:vParam,
                                                   contParam:cParam});
      if(sresult.length==0)
          return false;
      else 
          return true;
   }
  ////////////////////////////////////////////////////////////////////////////////////////





  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.vesselInfoRegistered} tx 
   * @transaction
   */
  async function vesselInfoRegister(tx) {
      let current = getCurrentParticipant();
      if(current.getIdentifier()!=tx.vessel.voa.getIdentifier())
          throw new Error('Not permitted');

      if(await checkTaskActiveFunc("viaRegistered",tx.vessel.vesselID,"",tx.vessel.voa.getIdentifier())
         || await checkTaskCompleteFunc("viaRegistered",tx.vessel.vesselID,"")
        )
          throw new Error('Already performed');

      await activateTask("VOA",current.getIdentifier(),"viaRegistered",tx.vessel,null);   	
      await activateTask("VOA",current.getIdentifier(),"IGMFiled",tx.vessel,null);   	
      await activateTask("VOA",current.getIdentifier(),"registeredVesselDetails",tx.vessel,null);   	
      await activateTask("VOA",current.getIdentifier(),"requestedBerthAllocation",tx.vessel,null);  	
  }



  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.viaRegistered} tx 
   * @transaction
   */
  async function viaRegister(tx) {
      let current = getCurrentParticipant();

      if(!await checkTaskActiveFunc("viaRegistered",tx.vessel.vesselID,"",current.getIdentifier()))
          throw new Error('Not permitted');

      await markTaskComplete("viaRegistered",tx.vessel.vesselID,"",current.getIdentifier());  
  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.IGMFiled} tx 
   * @transaction
   */
  async function IGMFile(tx) {
      let current = getCurrentParticipant()

      if(!await checkTaskActiveFunc("IGMFiled",tx.vessel.vesselID,"",current.getIdentifier()))
          throw new Error('Not permitted');

      await markTaskComplete("IGMFiled",tx.vessel.vesselID,"",current.getIdentifier());    	      	
  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.registeredVesselDetails} tx 
   * @transaction
   */
  async function registerVesselDetails(tx) {
      let current = getCurrentParticipant()

      if(!await checkTaskActiveFunc("registeredVesselDetails",tx.vessel.vesselID,null,current.getIdentifier()))
          throw new Error('Not permitted');


      if(await checkTaskCompleteFunc("requestedBerthAllocation",tx.vessel.vesselID,null)){
          await activateTask("PA","PA1","BerthAllocated",tx.vessel,null)   	
      }

      await markTaskComplete("registeredVesselDetails",tx.vessel.vesselID,null,current.getIdentifier());    	      		
  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.requestedBerthAllocation} tx 
   * @transaction
   */
  async function requestBerthAllocation(tx) {
      let current = getCurrentParticipant();

      if(!await checkTaskActiveFunc("requestedBerthAllocation", tx.vessel.vesselID, null, 
                                    current.getIdentifier()))
          throw new Error('Not permitted');


      if(await checkTaskCompleteFunc("registeredVesselDetails",tx.vessel.vesselID,null)){
          await activateTask("PA","PA1","BerthAllocated",tx.vessel,null)   	
      }

      await markTaskComplete("requestedBerthAllocation",tx.vessel.vesselID,null,current.getIdentifier());    	      		

  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.BerthAllocated} tx 
   * @transaction
   */
  async function BerthAllocate(tx) {
      let current = getCurrentParticipant();

      if(!await checkTaskActiveFunc("BerthAllocated", tx.vessel.vesselID, null, current.getIdentifier()))
          throw new Error('Not permitted');

      await activateTask("IMMIGRATION","IMMIGRATION1","immigrationCompletedFormalities",tx.vessel,null);   	
      await activateTask("CUSTOMS","CUSTOMS1","customsCompletedFormalities",tx.vessel,null);   	
      await activateTask("PHO","PHO1","PHOCompletedFormalities",tx.vessel,null);   	
      await activateTask("OA1","OA11","otherAuth1CompletedFormalities",tx.vessel,null);   	
      await activateTask("OA2","OA21","otherAuth2CompletedFormalities",tx.vessel,null);   	

      await markTaskComplete("BerthAllocated",tx.vessel.vesselID,null,current.getIdentifier());    	      		

  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.immigrationCompletedFormalities} tx 
   * @transaction
   */
  async function immigrationCompleteFormalities(tx) {
      let current = getCurrentParticipant();

      if(!await checkTaskActiveFunc("immigrationCompletedFormalities", tx.vessel.vesselID, null, 
                                    current.getIdentifier()))
          throw new Error('Not permitted');


      let cst_chk= await checkTaskCompleteFunc("customsCompletedFormalities",tx.vessel.vesselID,null);
      let pho_chk= await checkTaskCompleteFunc("PHOCompletedFormalities",tx.vessel.vesselID,null);
      let oth1_chk= await checkTaskCompleteFunc("otherAuth1CompletedFormalities",tx.vessel.vesselID,null);
      let oth2_chk= await checkTaskCompleteFunc("otherAuth2CompletedFormalities",tx.vessel.vesselID,null);
      if(cst_chk && pho_chk && oth1_chk && oth2_chk){
          await activateTask("LDB","LDB1","vesselUnloadingStarted",tx.vessel,null);   	
      }

      await markTaskComplete("immigrationCompletedFormalities",tx.vessel.vesselID,null,
                             current.getIdentifier());    	      		

  }

  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.customsCompletedFormalities} tx 
   * @transaction
   */
  async function customsCompleteFormalities(tx) {
      let current = getCurrentParticipant();

      if(!await checkTaskActiveFunc("customsCompletedFormalities", tx.vessel.vesselID, null, 
                                    current.getIdentifier()))
          throw new Error('Not permitted');



      let img_chk= await checkTaskCompleteFunc("immigrationCompletedFormalities",tx.vessel.vesselID,null);
      let pho_chk= await checkTaskCompleteFunc("PHOCompletedFormalities",tx.vessel.vesselID,null);
      let oth1_chk= await checkTaskCompleteFunc("otherAuth1CompletedFormalities",tx.vessel.vesselID,null);
      let oth2_chk= await checkTaskCompleteFunc("otherAuth2CompletedFormalities",tx.vessel.vesselID,null);
      if(img_chk && pho_chk && oth1_chk && oth2_chk){
          await activateTask("LDB","LDB1","vesselUnloadingStarted",tx.vessel,null);   	
      }

      await markTaskComplete("customsCompletedFormalities",tx.vessel.vesselID,null,
                             current.getIdentifier());    	      		

  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.PHOCompletedFormalities} tx 
   * @transaction
   */
  async function PHOCompleteFormalities(tx) {
      let current = getCurrentParticipant();

      if(!await checkTaskActiveFunc("PHOCompletedFormalities", tx.vessel.vesselID, null, 
                                    current.getIdentifier()))
          throw new Error('Not permitted');



      let img_chk= await checkTaskCompleteFunc("immigrationCompletedFormalities",tx.vessel.vesselID,null);
      let cst_chk= await checkTaskCompleteFunc("customsCompletedFormalities",tx.vessel.vesselID,null);
      let oth1_chk= await checkTaskCompleteFunc("otherAuth1CompletedFormalities",tx.vessel.vesselID,null);
      let oth2_chk= await checkTaskCompleteFunc("otherAuth2CompletedFormalities",tx.vessel.vesselID,null);
      if(cst_chk && img_chk && oth1_chk && oth2_chk){
          await activateTask("LDB","LDB1","vesselUnloadingStarted",tx.vessel,null);   	
      }

      await markTaskComplete("PHOCompletedFormalities",tx.vessel.vesselID,null,
                             current.getIdentifier());    	      		

  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.otherAuth1CompletedFormalities} tx 
   * @transaction
   */
  async function otherAuth1CompleteFormalities(tx) {
      let current = getCurrentParticipant();

      if(!await checkTaskActiveFunc("otherAuth1CompletedFormalities", tx.vessel.vesselID, null, 
                                    current.getIdentifier()))
          throw new Error('Not permitted');



      let img_chk= await checkTaskCompleteFunc("immigrationCompletedFormalities",tx.vessel.vesselID,null);
      let cst_chk= await checkTaskCompleteFunc("customsCompletedFormalities",tx.vessel.vesselID,null);
      let pho_chk= await checkTaskCompleteFunc("PHOCompletedFormalities",tx.vessel.vesselID,null);
      let oth2_chk= await checkTaskCompleteFunc("otherAuth2CompletedFormalities",tx.vessel.vesselID,null);
      if(cst_chk && pho_chk && img_chk && oth2_chk){
          await activateTask("LDB","LDB1","vesselUnloadingStarted",tx.vessel,null);   	
      }

      await markTaskComplete("otherAuth1CompletedFormalities",tx.vessel.vesselID,null,
                             current.getIdentifier());    	      		

  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.otherAuth2CompletedFormalities} tx 
   * @transaction
   */
  async function otherAuth2CompleteFormalities(tx) {
      let current = getCurrentParticipant();

      if(!await checkTaskActiveFunc("otherAuth2CompletedFormalities", tx.vessel.vesselID, null, 
                                    current.getIdentifier()))
          throw new Error('Not permitted');



      let img_chk= await checkTaskCompleteFunc("immigrationCompletedFormalities",tx.vessel.vesselID,null);
      let cst_chk= await checkTaskCompleteFunc("customsCompletedFormalities",tx.vessel.vesselID,null);
      let pho_chk= await checkTaskCompleteFunc("PHOCompletedFormalities",tx.vessel.vesselID,null);
      let oth1_chk= await checkTaskCompleteFunc("otherAuth1CompletedFormalities",tx.vessel.vesselID,null);
      if(cst_chk && pho_chk && oth1_chk && img_chk){
          await activateTask("LDB","LDB1","vesselUnloadingStarted",tx.vessel,null);   	
      }

      await markTaskComplete("otherAuth2CompletedFormalities",tx.vessel.vesselID,null,
                             current.getIdentifier());    	      		

  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.vesselUnloadingStarted} tx 
   * @transaction
   */
  async function vesselUnloadingStart(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("vesselUnloadingStarted", tx.vessel.vesselID, null, 
                                    current.getIdentifier()))
          throw new Error('Not permitted');

    let containers=await query('getListContainersOfVessel',{vesselParam:tx.vessel.vesselID});

    for (cid in containers){
          let container =  containers[cid];
          await activateTask("LDB","LDB1","containerDischarged",null,container);   	
    }

    await activateTask("LDB","LDB1","vesselUnloadingEnded",tx.vessel,null);   	
    await activateTask("LDB","LDB1","vesselLoadingStarted",tx.vessel,null);   	


    await markTaskComplete("vesselUnloadingStarted",tx.vessel.vesselID,null,current.getIdentifier());    	      		

  }

  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.vesselUnloadingEnded} tx 
   * @transaction
   */
  async function vesselUnloadingEnd(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("vesselUnloadingEnded", tx.vessel.vesselID, null, 
                                    current.getIdentifier()))
          throw new Error('Not permitted');

    await markTaskComplete("vesselUnloadingEnded",tx.vessel.vesselID,null,current.getIdentifier());    	      		

  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.vesselLoadingStarted} tx 
   * @transaction
   */
  async function vesselLoadingStart(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("vesselLoadingStarted", tx.vessel.vesselID, null, 
                                    current.getIdentifier()))
          throw new Error('Not permitted');


    await activateTask("LDB","LDB1","vesselLoadingEnded",tx.vessel,null);   	


    await markTaskComplete("vesselLoadingStarted",tx.vessel.vesselID,null,current.getIdentifier());    	      		

  }

  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.vesselLoadingEnded} tx 
   * @transaction
   */
  async function vesselLoadingEnd(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("vesselLoadingEnded", tx.vessel.vesselID, null, 
                                    current.getIdentifier()))
          throw new Error('Not permitted');

    await activateTask("LDB","LDB1","vesselDeparted",tx.vessel,null);   	


    await markTaskComplete("vesselLoadingEnded",tx.vessel.vesselID,null,current.getIdentifier());    	      		

  }





  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.containerDischarged} tx 
   * @transaction
   */
  async function containerDischarge(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("containerDischarged", null, tx.container.contID, 
                                    current.getIdentifier()))
          throw new Error('Not permitted oo');

    if(tx.container.designated=="DPD")
          await activateTask("COA","COA1","deliveryOrderIssued",null,tx.container);   	


    await markTaskComplete("containerDischarged",null,tx.container.contID,current.getIdentifier());    	      		

  }




  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.deliveryOrderIssued} tx 
   * @transaction
   */
  async function deliveryOrderIssue(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("deliveryOrderIssued", null, tx.container.contID, 
                                    current.getIdentifier()))
          throw new Error('Not permitted oo');

    await activateTask("CHA","CHA1","billOfEntryRegistered",null,tx.container);   	


    await markTaskComplete("deliveryOrderIssued",null,tx.container.contID,current.getIdentifier());    	      		

  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.billOfEntryRegistered} tx 
   * @transaction
   */
  async function billOfEntryRegister(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("billOfEntryRegistered", null, tx.container.contID, 
                                    current.getIdentifier()))
          throw new Error('Not permitted oo');

    await activateTask("CHA","CHA1","dutyPaid",null,tx.container);   	


    await markTaskComplete("billOfEntryRegistered",null,tx.container.contID,current.getIdentifier());    	      		

  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.dutyPaid} tx 
   * @transaction
   */
  async function dutyPay(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("dutyPaid", null, tx.container.contID, 
                                    current.getIdentifier()))
          throw new Error('Not permitted oo');

    await activateTask("CHA","CHA1","deliveryRequested",null,tx.container);   	


    await markTaskComplete("dutyPaid",null,tx.container.contID,current.getIdentifier());    	      		

  }


  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.deliveryRequested} tx 
   * @transaction
   */
  async function deliveryRequest(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("deliveryRequested", null, tx.container.contID, 
                                    current.getIdentifier()))
          throw new Error('Not permitted oo');

    await activateTask("TA","TA1","jobOrderIssued",null,tx.container);   	


    await markTaskComplete("deliveryRequested",null,tx.container.contID,current.getIdentifier());    	      		

  }
  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.jobOrderIssued} tx 
   * @transaction
   */
  async function jobOrderIssue(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("jobOrderIssued", null, tx.container.contID, 
                                    current.getIdentifier()))
          throw new Error('Not permitted oo');

    await activateTask("TA","TA1","containerLoadedInTruck",null,tx.container);   	


    await markTaskComplete("jobOrderIssued",null,tx.container.contID,current.getIdentifier());    	      		

  }
  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.containerLoadedInTruck} tx 
   * @transaction
   */
  async function containerLoadInTruck(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("containerLoadedInTruck", null, tx.container.contID, 
                                    current.getIdentifier()))
          throw new Error('Not permitted oo');

    await activateTask("LDB","LDB1","containerPortOut",null,tx.container);   	


    await markTaskComplete("containerLoadedInTruck",null,tx.container.contID,current.getIdentifier());    	      		

  }

  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.containerPortOut} tx 
   * @transaction
   */
  async function containerPortOutz(tx) {
    let current = getCurrentParticipant();

    if(!await checkTaskActiveFunc("containerPortOut", null, tx.container.contID, 
                                    current.getIdentifier()))
          throw new Error('Not permitted oo');    

    await markTaskComplete("containerPortOut",null,tx.container.contID,current.getIdentifier());    	      		

  }




  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.dummy_cont} tx 
   * @transaction
   */
  async function dummy_contz(tx) {
    let current = getCurrentParticipant();

   sresult=await query('getTasksForContainer',{contParam:tx.container.contID});
    
    	
  }
  /**
   * Sample transaction processor function.
   * @param {org.hack.sagarmala.dummy_vessel} tx 
   * @transaction
   */
  async function dummy_fcc(tx) {
    let current = getCurrentParticipant();

   sresult=await query('getTasksForVessel',{vesselParam:tx.vessel.vesselID});
    
    	
  }


