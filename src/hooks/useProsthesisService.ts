import { useState } from 'react';
import { ProsthesisService } from '@/domain/services/ProsthesisService';
import { PatientMeasurements } from '@/domain/entities/PatientMeasurements';
import { MainBody } from '@/domain/valueObjects/MainBody';
import { BranchOption } from '@/domain/valueObjects/BranchOption';
import { BranchSide } from '@/domain/enums/BranchSide';
import { BodiesRepoSupabase } from '@/infrastructure/repositories/BodiesRepoSupabase';
import { BranchesRepoSupabase } from '@/infrastructure/repositories/BranchesRepoSupabase';

/**
 * Prosthesis calculation results structure
 */
export type ProsthesisResults = {
  mainBody: MainBody | null;
  contralateralOptions: BranchOption[];
  ipsilateralOptions: BranchOption[];
  contralateralNeedsBridge: boolean;
  ipsilateralNeedsBridge: boolean;
};

/**
 * Hook to calculate prosthesis recommendations using hexagonal architecture
 */
export const useProsthesisService = () => {

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Calculates prosthesis recommendations based on patient measurements
   * 
   * @param measurements - PatientMeasurements entity
   * 
   * @returns ProsthesisResults containing main body and branch options
   */
  const calculateProsthesis = async (  measurements: PatientMeasurements ): Promise<ProsthesisResults> => {
    
    setIsLoading( true );
    
    try 
    {
      // Initialize repositories and service
      const bodiesRepo = new BodiesRepoSupabase();
      const branchesRepo = new BranchesRepoSupabase();
      
      const service = new ProsthesisService({
                                              bodiesRepo,
                                              branchesRepo,
                                              measurements,
                                            });

      // Initialize data
      await service.init();

      // Select main body
      const mainBody = service.selectMainBody( measurements.neckDiameter );

      if ( !mainBody ) 
      {
        return {
          mainBody: null,
          contralateralOptions: [],
          ipsilateralOptions: [],
          contralateralNeedsBridge: true,
          ipsilateralNeedsBridge: true,
        };
      }

      // Calculate contralateral branch options
      const contralateralResult = service.findBranchOptions(
                                                              BranchSide.CONTRALATERAL,
                                                              measurements.contralateralIliacDiameter,
                                                              mainBody.body.length,
                                                              mainBody.body.shortLeg,
                                                              measurements.contralateralDistance
                                                            );

      // Calculate ipsilateral branch options
      const ipsilateralResult = service.findBranchOptions(
                                                            BranchSide.IPSILATERAL,
                                                            measurements.ipsilateralIliacDiameter,
                                                            mainBody.body.length,
                                                            mainBody.body.longLeg,
                                                            measurements.ipsilateralDistance
                                                          );

      return {
        mainBody,
        contralateralOptions: contralateralResult.options,
        ipsilateralOptions: ipsilateralResult.options,
        contralateralNeedsBridge: contralateralResult.needsBridge,
        ipsilateralNeedsBridge: ipsilateralResult.needsBridge,
      };
    } 
    finally
    {
      setIsLoading( false );
    }
  };

  return { calculateProsthesis, isLoading };
};
