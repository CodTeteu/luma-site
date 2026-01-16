"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    briefingSchema,
    step1Schema,
    step2Schema,
    step3Schema,
    BriefingFormData,
    defaultBriefingValues,
} from "@/lib/briefingSchema";
import { StepCoupleEvent } from "./StepCoupleEvent";
import { StepVisualIdentity } from "./StepVisualIdentity";
import { StepPixData } from "./StepPixData";
import { SummaryCard } from "./SummaryCard";
import { logger } from "@/services/logger";

const steps = [
    { id: 1, title: "O Casal", schema: step1Schema },
    { id: 2, title: "Visual", schema: step2Schema },
    { id: 3, title: "PIX", schema: step3Schema },
];

export function BriefingWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);

    const form = useForm<BriefingFormData>({
        resolver: zodResolver(briefingSchema),
        defaultValues: defaultBriefingValues,
        mode: "onChange",
    });

    const validateCurrentStep = async (): Promise<boolean> => {
        const currentSchema = steps[currentStep - 1].schema;
        const currentFields = Object.keys(currentSchema.shape);

        const result = await form.trigger(currentFields as (keyof BriefingFormData)[]);
        return result;
    };

    const handleNext = async () => {
        const isValid = await validateCurrentStep();
        if (isValid) {
            if (currentStep < steps.length) {
                setCurrentStep((prev) => prev + 1);
            } else {
                // Último passo - finalizar
                const allValid = await form.trigger();
                if (allValid) {
                    logger.formSubmission("Briefing", form.getValues());
                    setIsCompleted(true);
                }
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleReset = () => {
        form.reset(defaultBriefingValues);
        setCurrentStep(1);
        setIsCompleted(false);
    };

    const handleEdit = () => {
        setIsCompleted(false);
        // Opcional: voltar para o último passo
        // setCurrentStep(steps.length);
    };

    if (isCompleted) {
        return <SummaryCard data={form.getValues()} onReset={handleReset} onEdit={handleEdit} />;
    }

    return (
        <div className="space-y-8">
            {/* Organic Progress Indicator */}
            <div className="flex justify-center mb-10">
                <div className="inline-flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border border-[#DCD3C5]">
                    {steps.map((step) => {
                        const isActive = step.id === currentStep;
                        const isComplete = step.id < currentStep;

                        return (
                            <div key={step.id} className="flex items-center gap-2">
                                {/* Visual Circle */}
                                <div
                                    className={`
                    w-2.5 h-2.5 rounded-full transition-all duration-500
                    ${isActive
                                            ? "bg-[#C19B58] scale-125"
                                            : isComplete
                                                ? "bg-[#2A3B2E]"
                                                : "bg-[#DCD3C5]"
                                        }
                  `}
                                />

                                {/* Text Label (Only for active step) */}
                                {isActive && (
                                    <span className="text-sm font-medium text-[#2A3B2E] font-heading tracking-wide animate-fade-in">
                                        {step.title}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form Card */}
            <Card className="shadow-2xl shadow-[#2A3B2E]/5 border-white/50 bg-white/80">
                <CardContent className="p-8 md:p-12">
                    <form onSubmit={(e) => e.preventDefault()}>
                        {/* Step Content */}
                        <div className="min-h-[400px]">
                            {currentStep === 1 && <StepCoupleEvent form={form} />}
                            {currentStep === 2 && <StepVisualIdentity form={form} />}
                            {currentStep === 3 && <StepPixData form={form} />}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-12 pt-8 border-t border-[#DCD3C5]/30">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className="gap-2 text-[#6B7A6C] hover:text-[#2A3B2E] transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Anterior
                            </Button>

                            <Button
                                type="button"
                                onClick={handleNext}
                                variant={currentStep === steps.length ? "gold" : "default"}
                                className="gap-2 px-8"
                            >
                                {currentStep === steps.length ? (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Finalizar
                                    </>
                                ) : (
                                    <>
                                        Próximo Passo
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
