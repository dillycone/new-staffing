"use client";

import * as React from "react";
import { ScoringRule } from "@/types/scoring";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";

interface CategoryEditorProps {
  categoryName: string;
  weight: number;
  rules: ScoringRule[];
  onRulesChange: (rules: ScoringRule[]) => void;
}

export function CategoryEditor({
  categoryName,
  weight,
  rules,
  onRulesChange,
}: CategoryEditorProps) {
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const handleAddKeyword = (ruleIndex: number, type: 'bonus' | 'penalty' | 'required') => {
    const updatedRules = [...rules];
    const rule = updatedRules[ruleIndex];

    if (type === 'bonus') {
      if (!rule.bonusKeywords) rule.bonusKeywords = [];
      rule.bonusKeywords.push({ keyword: '', points: 1 });
    } else if (type === 'penalty') {
      if (!rule.penaltyKeywords) rule.penaltyKeywords = [];
      rule.penaltyKeywords.push({ keyword: '', points: -1 });
    } else if (type === 'required') {
      if (!rule.requiredAny) rule.requiredAny = [];
      rule.requiredAny.push('');
    }

    onRulesChange(updatedRules);
  };

  const handleRemoveKeyword = (
    ruleIndex: number,
    keywordIndex: number,
    type: 'bonus' | 'penalty' | 'required'
  ) => {
    const updatedRules = [...rules];
    const rule = updatedRules[ruleIndex];

    if (type === 'bonus' && rule.bonusKeywords) {
      rule.bonusKeywords.splice(keywordIndex, 1);
    } else if (type === 'penalty' && rule.penaltyKeywords) {
      rule.penaltyKeywords.splice(keywordIndex, 1);
    } else if (type === 'required' && rule.requiredAny) {
      rule.requiredAny.splice(keywordIndex, 1);
    }

    onRulesChange(updatedRules);
  };

  const handleUpdateKeyword = (
    ruleIndex: number,
    keywordIndex: number,
    type: 'bonus' | 'penalty' | 'required',
    field: 'keyword' | 'points',
    value: string | number
  ) => {
    const updatedRules = [...rules];
    const rule = updatedRules[ruleIndex];

    if (type === 'bonus' && rule.bonusKeywords) {
      if (field === 'keyword') {
        rule.bonusKeywords[keywordIndex].keyword = value as string;
      } else {
        rule.bonusKeywords[keywordIndex].points = Number(value);
      }
    } else if (type === 'penalty' && rule.penaltyKeywords) {
      if (field === 'keyword') {
        rule.penaltyKeywords[keywordIndex].keyword = value as string;
      } else {
        rule.penaltyKeywords[keywordIndex].points = Number(value);
      }
    } else if (type === 'required' && rule.requiredAny) {
      rule.requiredAny[keywordIndex] = value as string;
    }

    onRulesChange(updatedRules);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h3 className="text-lg font-semibold">{categoryName}</h3>
          <p className="text-sm text-muted-foreground">Weight: {weight}%</p>
        </div>
      </div>

      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="space-y-2"
      >
        {rules.map((rule, ruleIndex) => (
          <AccordionItem
            key={ruleIndex}
            value={`rule-${ruleIndex}`}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between flex-1 pr-2">
                <span className="font-medium">{rule.name}</span>
                <Badge variant="outline" className="ml-2">
                  0-{rule.maxPoints} pts
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">{rule.description}</p>

                {/* Required Keywords */}
                {rule.requiredAny && rule.requiredAny.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">
                      Required (any)
                    </Label>
                    <div className="space-y-2">
                      {rule.requiredAny.map((keyword, keywordIndex) => (
                        <div key={keywordIndex} className="flex items-center gap-2">
                          <Input
                            value={keyword}
                            onChange={(e) =>
                              handleUpdateKeyword(
                                ruleIndex,
                                keywordIndex,
                                'required',
                                'keyword',
                                e.target.value
                              )
                            }
                            placeholder="e.g., react"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveKeyword(ruleIndex, keywordIndex, 'required')
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bonus Keywords */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">
                      Bonus Keywords
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddKeyword(ruleIndex, 'bonus')}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {rule.bonusKeywords?.map((bonus, keywordIndex) => (
                      <div key={keywordIndex} className="flex items-center gap-2">
                        <Input
                          value={bonus.keyword}
                          onChange={(e) =>
                            handleUpdateKeyword(
                              ruleIndex,
                              keywordIndex,
                              'bonus',
                              'keyword',
                              e.target.value
                            )
                          }
                          placeholder="Keyword"
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={bonus.points}
                          onChange={(e) =>
                            handleUpdateKeyword(
                              ruleIndex,
                              keywordIndex,
                              'bonus',
                              'points',
                              e.target.value
                            )
                          }
                          placeholder="Points"
                          className="w-20"
                          step="0.5"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveKeyword(ruleIndex, keywordIndex, 'bonus')
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Penalty Keywords */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">
                      Penalty Keywords
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddKeyword(ruleIndex, 'penalty')}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {rule.penaltyKeywords?.map((penalty, keywordIndex) => (
                      <div key={keywordIndex} className="flex items-center gap-2">
                        <Input
                          value={penalty.keyword}
                          onChange={(e) =>
                            handleUpdateKeyword(
                              ruleIndex,
                              keywordIndex,
                              'penalty',
                              'keyword',
                              e.target.value
                            )
                          }
                          placeholder="Keyword"
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={penalty.points}
                          onChange={(e) =>
                            handleUpdateKeyword(
                              ruleIndex,
                              keywordIndex,
                              'penalty',
                              'points',
                              e.target.value
                            )
                          }
                          placeholder="Points"
                          className="w-20"
                          step="0.5"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveKeyword(ruleIndex, keywordIndex, 'penalty')
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
